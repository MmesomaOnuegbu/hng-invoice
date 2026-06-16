"use client";

import { useState, use, useCallback } from "react";
import { getInvoiceById } from "@/lib/actions";
import { InvoiceDetailsHeader } from "@/components/InvoiceDetailsHeader";
import { InvoiceMainInfo } from "@/components/InvoiceMainInfo";
import { notFound } from "next/navigation";
import type { Invoice } from "@/types/invoice";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Function to get the latest data from Local Storage
  const loadInvoice = useCallback(() => {
    if (typeof window !== "undefined") {
      return getInvoiceById(id) || null;
    }
    return null;
  }, [id]);

  const [invoice, setInvoice] = useState<Invoice | null>(loadInvoice);

  const handleRefresh = () => {
    setInvoice(loadInvoice());
  };

  if (!invoice) {
    notFound();
  }

  return (
    <main className="md:max-w-227.5 mx-auto py-18 md:py-10">
      {/* Pass the refresh function here */}
      <InvoiceDetailsHeader 
        invoice={invoice} 
        onActionComplete={handleRefresh} 
      />
      <InvoiceMainInfo invoice={invoice} />
    </main>
  );
}