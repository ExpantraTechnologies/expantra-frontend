"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Business } from "@/types/business";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function ClientsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          `
          id,
          name,
          phone_number,
          industry,
          plan,
          minutes_limit,
          minutes_used,
          billing_status,
          renewal_date,
          created_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching businesses:", error);
      } else {
        setBusinesses(data as Business[]);
      }

      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title + Add Client Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <button className="text-sm px-3 py-1.5 rounded-md border bg-white">
          Add Client
        </button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : businesses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No clients yet. Add your first client to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Billing Status</TableHead>
                  <TableHead>Minutes</TableHead>
                  <TableHead>Renewal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.phone_number ?? "—"}</TableCell>
                    <TableCell>{b.plan ?? "—"}</TableCell>
                    <TableCell>{b.billing_status ?? "—"}</TableCell>
                    <TableCell>
                      {b.minutes_used ?? 0}/{b.minutes_limit ?? 0}
                    </TableCell>
                    <TableCell>
                      {b.renewal_date
                        ? new Date(b.renewal_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
