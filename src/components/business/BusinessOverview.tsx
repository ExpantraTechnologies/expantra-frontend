export default function BusinessOverview({ business, onEdit }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{business.name}</h1>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md"
        >
          Edit Business Info
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <p><strong>Industry:</strong> {business.industry}</p>
        <p><strong>Phone:</strong> {business.phone_number}</p>
        <p><strong>Plan:</strong> {business.plan}</p>
        <p><strong>Billing Status:</strong> {business.billing_status}</p>
        <p><strong>Minutes:</strong> {business.minutes_used}/{business.minutes_limit}</p>
        <p><strong>Renewal Date:</strong> {business.renewal_date}</p>
        <p><strong>Stripe Customer ID:</strong> {business.stripe_customer_id}</p>
        <p><strong>Stripe Subscription ID:</strong> {business.stripe_subscription_id}</p>
        <p><strong>Created At:</strong> {business.created_at}</p>
      </div>
    </div>
  );
}
