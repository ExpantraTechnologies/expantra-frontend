"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomerSkeleton } from "./CustomerSkeleton";
import { AddCustomerSheet } from "./AddCustomerSheet";
import { EditCustomerSheet } from "./EditCustomerSheet";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import type { Customer } from "@/types/customer";

export function BusinessCustomers({ businessId }: { businessId: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseClient
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to load customers");
      setLoading(false);
      return;
    }

    setCustomers((data as Customer[]) || []);
    setLoading(false);
  }

  // -----------------------------
  // OPTIMISTIC UPDATE HELPERS
  // -----------------------------

  function optimisticAdd(temp: Customer) {
    setCustomers((prev) => [temp, ...prev]);
  }

  function optimisticEdit(updated: Customer) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }

  function optimisticDelete(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  // -----------------------------
  // SHEET / DIALOG OPENERS
  // -----------------------------

  function openEdit(customer: Customer) {
    setSelectedCustomer(customer);
    setEditOpen(true);
  }

  function openDelete(customer: Customer) {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customers</h2>
        <Button onClick={() => setAddOpen(true)}>Add Customer</Button>
      </div>

      {/* Loading */}
      {loading && <CustomerSkeleton />}

      {/* Error */}
      {!loading && error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && customers.length === 0 && (
        <p className="text-muted-foreground text-sm">No customers yet.</p>
      )}

      {/* List */}
      {!loading && customers.length > 0 && (
        <div className="space-y-3">
          {customers.map((customer) => (
            <Card key={customer.id} className="p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">
                  {customer.name || "Unnamed"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {customer.phone || ""}
                </span>
              </div>

              {customer.email && (
                <p className="text-muted-foreground">{customer.email}</p>
              )}

              {customer.notes && (
                <p className="text-xs text-muted-foreground">
                  Notes: {customer.notes}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(customer)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(customer)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sheets & Dialogs */}
      <AddCustomerSheet
        open={addOpen}
        setOpen={setAddOpen}
        businessId={businessId}
        onComplete={fetchCustomers}
        optimisticAdd={optimisticAdd}
      />

      <EditCustomerSheet
        open={editOpen}
        setOpen={setEditOpen}
        customer={selectedCustomer}
        businessId={businessId}
        onComplete={fetchCustomers}
        optimisticEdit={optimisticEdit}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        customer={selectedCustomer}
        onComplete={fetchCustomers}
        optimisticDelete={optimisticDelete}
      />
    </div>
  );
}
