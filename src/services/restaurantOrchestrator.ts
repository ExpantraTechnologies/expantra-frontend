import { supabase } from "@/lib/supabaseClient";
import { RestaurantIntentPayload } from "../types/restaurantIntents";
import { sendRestaurantNotification } from "./notifications/restaurantNotifications";

export class RestaurantOrchestrator {
  static async handleIntent(intent: RestaurantIntentPayload) {
    switch (intent.type) {
      case "order":
        return this.handleOrder(intent);
      case "reservation":
        return this.handleReservation(intent);
      case "question":
        return this.handleQuestion(intent);
    }
  }

  private static async handleOrder(intent: any) {
    const business_id = intent.business_id;

    // 1. Validate menu items
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("id,name")
      .eq("business_id", business_id)
      .eq("is_active", true);

    const nameToId = new Map(
      menuItems?.map((m: any) => [m.name.toLowerCase(), m.id])
    );

    // 2. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        business_id,
        source: "phone",
        customer_name: intent.customer_name,
        customer_phone: intent.customer_phone,
        mode: intent.mode,
        scheduled_time:
          intent.scheduled_time && intent.scheduled_time !== "asap"
            ? intent.scheduled_time
            : null,
        raw_payload: intent,
        status: "pending",
      })
      .select("*")
      .single();

    if (orderError) throw orderError;

    // 3. Create order items
    const orderItems = intent.items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: nameToId.get(item.menu_item_name.toLowerCase()) ?? null,
      qty: item.qty,
      notes: [
        item.notes,
        ...(item.modifiers ?? []).map((m: any) => m.name),
      ]
        .filter(Boolean)
        .join(" | "),
    }));

    await supabase.from("order_items").insert(orderItems);

    // 4. Fallback (POS removed)
    await sendRestaurantNotification({
      business_id,
      order,
      orderItems,
      intent,
    });

    await supabase
      .from("orders")
      .update({ status: "sent_via_sms" })
      .eq("id", order.id);

    return { order_id: order.id, status: "ok" };
  }

  private static async handleReservation(intent: any) {
    const business_id = intent.business_id;

    const datetime = new Date(`${intent.date}T${intent.time}`);

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        business_id,
        customer_name: intent.customer_name,
        customer_phone: intent.customer_phone,
        party_size: intent.party_size,
        time: datetime.toISOString(),
        notes: intent.notes,
        status: "confirmed",
      })
      .select("*")
      .single();

    if (error) throw error;

    await sendRestaurantNotification({
      business_id,
      reservation,
      intent,
    });

    return { reservation_id: reservation.id, status: "ok" };
  }

  private static async handleQuestion(intent: any) {
    const business_id = intent.business_id;

    if (intent.question_type === "basic_info") {
      const { data: business } = await supabase
        .from("businesses")
        .select("industry_config")
        .eq("id", business_id)
        .single();

      return {
        type: "basic_info",
        industry_config: business?.industry_config ?? {},
      };
    }

    const { data: menuItem } = await supabase
      .from("menu_items")
      .select("id,name")
      .eq("business_id", business_id)
      .ilike("name", intent.menu_item_name)
      .single();

    if (!menuItem) {
      return { type: "question", answer: "item_not_found" };
    }

    const { data: ingredients } = await supabase
      .from("menu_item_ingredients")
      .select("ingredient:ingredients(*)")
      .eq("menu_item_id", menuItem.id);

    const ingredientList = ingredients?.map((row: any) => row.ingredient) ?? [];

    return {
      type: "question",
      menu_item_name: menuItem.name,
      ingredients: ingredientList,
    };
  }
}
