import { useState } from "react";
import { useRouter } from "next/router";

import { useServices } from "@/hooks/api/useServices";
import { useCreateService } from "@/hooks/api/useCreateService";
import { useUpdateService } from "@/hooks/api/useUpdateService";
import { useDeleteService } from "@/hooks/api/useDeleteService";

export default function ServicesPage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: services, isLoading } = useServices(businessId);
  const createService = useCreateService(businessId);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: ""
  });

  const handleCreate = async () => {
    await createService.mutateAsync({
      name: newService.name,
      description: newService.description,
      price: Number(newService.price)
    });

    setNewService({ name: "", description: "", price: "" });
    alert("Service created");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading services…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Services</h1>

      {/* Add New Service */}
      <div className="border p-4 rounded mb-8">
        <h2 className="text-lg font-medium mb-4">Add New Service</h2>

        <div className="space-y-4">
          <input
            placeholder="Service Name"
            value={newService.name}
            onChange={e => setNewService({ ...newService, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            placeholder="Description"
            value={newService.description}
            onChange={e => setNewService({ ...newService, description: e.target.value })}
            className="w-full border rounded px-3 py-2 h-20"
          />

          <input
            placeholder="Price"
            value={newService.price}
            onChange={e => setNewService({ ...newService, price: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />

          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Service
          </button>
        </div>
      </div>

      {/* Existing Services */}
      <div className="space-y-6">
        {services?.map((service: any) => (
          <ServiceItem
            key={service.id}
            businessId={businessId}
            service={service}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceItem({ businessId, service }: any) {
  const updateService = useUpdateService(businessId, service.id);
  const deleteService = useDeleteService(businessId, service.id);

  const [form, setForm] = useState({
    name: service.name,
    description: service.description,
    price: service.price
  });

  const handleUpdate = async () => {
    await updateService.mutateAsync({
      name: form.name,
      description: form.description,
      price: Number(form.price)
    });
    alert("Service updated");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService.mutateAsync();
      alert("Service deleted");
    }
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-medium mb-4">Edit Service</h3>

      <div className="space-y-4">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2 h-20"
        />

        <input
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
