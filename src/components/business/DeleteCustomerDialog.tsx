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
import type { Customer } from "@/types/customer";

export function DeleteCustomerDialog({
  open,
  setOpen,
  customer,
  onComplete,
  optimisticDelete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  customer: Customer | null;
  onComplete: () => void;
  optimisticDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!customer) return;

    setLoading(true);

    // Optimistic removal
    optimisticDelete(customer.id);

    // Close immediately
    setOpen(false);

    // Persist deletion
    await supabaseClient
      .from("customers")
      .delete()
      .eq("id", customer.id);

    onComplete();
    setLoading(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{customer?.name || "this customer"}</strong> and all related
            information.
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
