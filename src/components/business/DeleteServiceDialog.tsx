"use client";

import { supabase } from "@/lib/supabaseClient";
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
import type { Service } from "@/types/service";

export function DeleteServiceDialog({
  open,
  setOpen,
  service,
  onComplete,
  optimisticDelete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  service: Service | null;
  onComplete: () => void;
  optimisticDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!service) return;

    setLoading(true);

    // Optimistic delete
    optimisticDelete(service.id);

    // Close immediately
    setOpen(false);

    // Send to Supabase
    await supabase
      .from("services")
      .delete()
      .eq("id", service.id);

    onComplete();
    setLoading(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{service?.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
