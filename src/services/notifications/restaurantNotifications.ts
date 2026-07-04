interface RestaurantNotificationPayload {
  business_id: string;
  order?: any;
  orderItems?: any[];
  reservation?: any;
  intent: any;
}

export async function sendRestaurantNotification(payload: RestaurantNotificationPayload) {
  const { business_id, order, orderItems, reservation, intent } = payload;

  // Your existing notification logic goes here.
  // Example:
  // await supabase.from("sms_notifications").insert({
  //   business_id,
  //   message: JSON.stringify(payload),
  // });

  console.log("Restaurant notification:", payload);
}
