"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddServiceSheet } from "./AddServiceSheet";
import { EditServiceSheet } from "./EditServiceSheet";
import { DeleteServiceDialog } from "./DeleteServiceDialog";
import { ServiceSkeleton } from "./ServiceSkeleton";
import { formatPrice } from "@/lib/formatPrice";
import { formatDuration } from "@/lib/formatDuration";
import type { Service } from "@/types/service";

export function BusinessServices({ businessId }: { businessId: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseClient
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to load services");
      setLoading(false);
      return;
    }

    setServices((data as Service[]) || []);
    setLoading(false);
  }

  // -----------------------------
  // OPTIMISTIC UPDATE HELPERS
  // -----------------------------

  function optimisticAdd(temp: Service) {
    setServices((prev) => [temp, ...prev]);
  }

  function optimisticEdit(updated: Service) {
    setServices((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }

  function optimisticDelete(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  // -----------------------------
  // SHEET / DIALOG OPENERS
  // -----------------------------

  function openEdit(service: Service) {
    setSelectedService(service);
    setEditOpen(true);
  }

  function openDelete(service: Service) {
    setSelectedService(service);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Services</h2>
        <Button onClick={() => setAddOpen(true)}>Add Service</Button>
      </div>

      {/* Loading State */}
      {loading && <ServiceSkeleton />}

      {/* Error State */}
      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* Empty State */}
      {!loading && !error && services.length === 0 && (
        <p className="text-muted-foreground">No services added yet.</p>
      )}

      {/* Desktop Table */}
      {!loading && services.length > 0 && (
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Duration</th>
                <th className="py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b text-sm">
                  <td className="py-3">{service.name}</td>
                  <td className="py-3">{service.category || "-"}</td>
                  <td className="py-3">{formatPrice(service.price)}</td>
                  <td className="py-3">{formatDuration(service.duration_minutes)}</td>
                  <td className="py-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDelete(service)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && services.length > 0 && (
        <div className="md:hidden space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="p-4 space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">{service.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(service.price)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {service.category || "No category"}
              </p>

              <p className="text-sm">{formatDuration(service.duration_minutes)}</p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(service)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sheets & Dialogs */}
      <AddServiceSheet
        open={addOpen}
        setOpen={setAddOpen}
        businessId={businessId}
        onComplete={fetchServices}
        optimisticAdd={optimisticAdd}
      />

      <EditServiceSheet
        open={editOpen}
        setOpen={setEditOpen}
        service={selectedService}
        onComplete={fetchServices}
        optimisticEdit={optimisticEdit}
      />

      <DeleteServiceDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        service={selectedService}
        onComplete={fetchServices}
        optimisticDelete={optimisticDelete}
      />
    </div>
  );
}
