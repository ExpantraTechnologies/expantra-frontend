import { supabase } from "@/lib/supabaseClient";
import { generateAIResponse } from "./response";
import { getBusinessContext } from "./state";
import { detectIntent } from "./intent";
import { parseNaturalDateTime } from "./datetime";
import { checkAvailability, createAppointment } from "./booking";
import {
  getCustomerAppointments,
  updateAppointmentTime,
  cancelAppointment,
} from "./appointments";
import {
  saveConversationTurn,
  getConversationHistory,
} from "./memory";
import { suggestAlternativeTimes } from "./suggestions";

interface AIRequest {
  businessId: string;
  customerMessage: string;
  customerPhone?: string;
  channel?: string;
}

export async function runAIReceptionist({
  businessId,
  customerMessage,
  customerPhone,
  channel,
}: AIRequest) {

  // ⭐ MEMORY: Save customer message
  if (customerPhone) {
    await saveConversationTurn(
      businessId,
      customerPhone,
      "customer",
      customerMessage
    );
  }

  // 1. Load all business context
  const context = await getBusinessContext(businessId, customerPhone);

  // 2. Detect intent
  const intent = await detectIntent(customerMessage);
  console.log("AI Intent:", intent);

  // ============================================================
  // 3. BOOKING FLOW
  // ============================================================
  if (
    intent.intent === "book" &&
    intent.serviceName &&
    intent.date &&
    intent.time
  ) {
    const parsed = await parseNaturalDateTime(customerMessage);

    if (!parsed.iso) {
      const reply = `Got it — you want a ${intent.serviceName}. What date and time works best for you?`;

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    // Match service name → service ID
    const service = (context.services ?? []).find(
      (s: any) =>
        s.name.toLowerCase().includes((intent.serviceName ?? "").toLowerCase()) ||
        (intent.serviceName ?? "").toLowerCase().includes(s.name.toLowerCase())
    );

    if (!service) {
      const reply = `I can help with that! But I couldn’t find a service called "${intent.serviceName}". Here are the services we offer:\n${(context.services ?? [])
        .map((s: any) => `• ${s.name}`)
        .join("\n")}`;

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    // Check availability (internal + external CRM)
    const availability = await checkAvailability({
      businessId,
      serviceId: service.id,
      customerId: context.customer?.id || null,
      requestedStart: parsed.iso,
    });

    if (!availability.available) {
      const alternatives = suggestAlternativeTimes(
        parsed.iso,
        service.duration_minutes
      );

      const reply = `That time isn’t available — ${availability.reason}. Here are some nearby options:\n\n${alternatives
        .map((iso) => {
          const d = new Date(iso);
          return `• ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`;
        })
        .join("\n")}\n\nWould you like one of these?`;

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    // Create appointment
    const appointment = await createAppointment({
      businessId,
      serviceId: service.id,
      customerId: context.customer?.id || null,
      requestedStart: parsed.iso,
    });

    if (appointment.error) {
      const reply = `Something went wrong while booking — please try again or choose another time.`;

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const reply = `All set! I booked your ${service.name} for ${intent.date} at ${intent.time}. Looking forward to seeing you!`;

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 4. RESCHEDULE FLOW
  // ============================================================
  if (intent.intent === "reschedule") {
    if (!context.customer) {
      const reply = "I can help with that! What’s your phone number so I can find your appointment?";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const appts = await getCustomerAppointments(businessId, context.customer.id);

    if (appts.length === 0) {
      const reply = "I couldn’t find any upcoming appointments for you. Want to book one instead?";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const parsed = await parseNaturalDateTime(customerMessage);

    if (!parsed.iso) {
      const reply = "Sure — what date and time would you like to move it to?";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const appt = appts[0];
    const service = (context.services ?? []).find((s: any) => s.id === appt.service_id);

    const availability = await checkAvailability({
      businessId,
      serviceId: service.id,
      customerId: context.customer.id,
      requestedStart: parsed.iso,
    });

    if (!availability.available) {
      const reply = `That time isn’t available — ${availability.reason}. Want me to suggest alternatives?`;

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const updated = await updateAppointmentTime(
      appt.id,
      parsed.iso,
      service.duration_minutes
    );

    if (updated.error) {
      const reply = "Something went wrong while rescheduling. Please try again.";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const reply = `All set — I moved your ${service.name} to ${intent.date} at ${intent.time}.`;

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 5. CANCELLATION FLOW
  // ============================================================
  if (intent.intent === "cancel") {
    if (!context.customer) {
      const reply = "I can cancel that for you — what’s your phone number so I can find your appointment?";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const appts = await getCustomerAppointments(businessId, context.customer.id);

    if (appts.length === 0) {
      const reply = "I couldn’t find any upcoming appointments to cancel.";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const appt = appts[0];
    const service = (context.services ?? []).find((s: any) => s.id === appt.service_id);

    const result = await cancelAppointment(appt.id);

    if (result.error) {
      const reply = "Something went wrong while canceling. Please try again.";

      if (customerPhone) {
        await saveConversationTurn(businessId, customerPhone, "assistant", reply);
      }

      return reply;
    }

    const reply = `Your ${service.name} appointment has been canceled.`;

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 6. HOURS
  // ============================================================
  if (intent.intent === "ask_hours") {
    const reply = `Here are our hours:\n${(context.hours ?? [])
      .map(
        (h: any) =>
          `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h.day_of_week]}: ${
            h.is_closed ? "Closed" : `${h.open_time}–${h.close_time}`
          }`
      )
      .join("\n")}`;

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 7. SERVICES
  // ============================================================
  if (intent.intent === "ask_services") {
    const reply = `Here are our services:\n${(context.services ?? [])
      .map((s: any) => `• ${s.name} (${s.duration_minutes} min)`)
      .join("\n")}`;

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 8. GREETING
  // ============================================================
  if (intent.intent === "greeting") {
    const reply = "Hi there! How can I help you today?";

    if (customerPhone) {
      await saveConversationTurn(businessId, customerPhone, "assistant", reply);
    }

    return reply;
  }

  // ============================================================
  // 9. FALLBACK AI RESPONSE
  // ============================================================
  const reply = await generateAIResponse({
    message: customerMessage,
    context,
    channel,
  });

  if (customerPhone) {
    await saveConversationTurn(businessId, customerPhone, "assistant", reply ?? "");
  }

  return reply;
}
