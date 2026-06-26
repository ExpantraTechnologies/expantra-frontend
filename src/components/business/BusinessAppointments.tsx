"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppointmentSkeleton } from "./AppointmentSkeleton";
import { AddAppointmentSheet } from "./AddAppointmentSheet";
import { EditAppointmentSheet } from "./EditAppointmentSheet";
import { DeleteAppointmentDialog } from "./DeleteAppointmentDialog";
import type { Appointment } from "@/types/appointment";

export function BusinessAppointments({ businessId }: { businessId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseClient
      .from("appointments")
      .select("*")
      .eq("business_id", businessId)
      .order("starts_at", { ascending: true });

    if (error) {
      setError("Failed to load appointments");
      setLoading(false);
      return;
    }

    setAppointments((data as Appointment[]) || []);
    setLoading(false);
  }

  // -----------------------------
  // OPTIMISTIC UPDATE HELPERS
  // -----------------------------

  function optimisticAdd(temp: Appointment) {
    setAppointments((prev) => [...prev, temp]);
  }

  function optimisticEdit(updated: Appointment) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }

  function optimisticDelete(id: string) {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  // -----------------------------
  // SHEET / DIALOG OPENERS
  // -----------------------------

  function openEdit(appt: Appointment) {
    setSelectedAppointment(appt);
    setEditOpen(true);
  }

  function openDelete(appt: Appointment) {
    setSelectedAppointment(appt);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <Button onClick={() => setAddOpen(true)}>Add Appointment</Button>
      </div>

      {/* Loading */}
      {loading && <AppointmentSkeleton />}

      {/* Error */}
      {!loading && error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-muted-foreground text-sm">No appointments yet.</p>
      )}

      {/* List */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <Card key={appt.id} className="p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">
                  {new Date(appt.starts_at).toLocaleString()}
                </span>
                <span className="uppercase text-xs text-muted-foreground">
                  {appt.status}
                </span>
              </div>

              <p className="text-muted-foreground">
                Service: {appt.service_id || "N/A"} · Customer: {appt.customer_id || "N/A"}
              </p>

              {appt.notes && (
                <p className="text-xs text-muted-foreground">
                  Notes: {appt.notes}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(appt)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(appt)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sheets & Dialogs */}
      <AddAppointmentSheet
        open={addOpen}
        setOpen={setAddOpen}
        businessId={businessId}
        onComplete={fetchAppointments}
        optimisticAdd={optimisticAdd}
      />

      <EditAppointmentSheet
        open={editOpen}
        setOpen={setEditOpen}
        appointment={selectedAppointment}
        businessId={businessId}
        onComplete={fetchAppointments}
        optimisticEdit={optimisticEdit}
      />

      <DeleteAppointmentDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        appointment={selectedAppointment}
        onComplete={fetchAppointments}
        optimisticDelete={optimisticDelete}
      />
    </div>
  );
}
