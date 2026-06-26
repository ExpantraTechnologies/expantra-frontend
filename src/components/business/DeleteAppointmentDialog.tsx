"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Appointment } from "@/types/appointment";

export function DeleteAppointmentDialog({
  open,
  setOpen,
  appointment,
  onComplete,
  optimisticDelete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  appointment: Appointment | null;
  onComplete: () => void;
  optimisticDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!appointment) return;

    setLoading(true);

    // Optimistic removal
    optimisticDelete(appointment.id);

    // Close immediately
    setOpen(false);

    // Persist deletion
    await supabaseClient
      .from("appointments")
      .delete()
      .eq("id", appointment.id);

    onComplete();
    setLoading(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            appointment scheduled for{" "}
            <strong>
              {appointment
                ? new Date(appointment.starts_at).toLocaleString()
                : ""}
            </strong>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
