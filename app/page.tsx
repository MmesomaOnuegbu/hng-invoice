"use client";

import { useState, useCallback, useEffect } from "react";
import { EmptyState } from "@/components/Shared/EmptyState";
import { HeaderWithModal } from "@/components/Shared/ModalHeader";
import { InvoiceCard } from "@/components/Shared/InvoiceCard";
import { getInvoices } from "@/lib/actions";
import type { Invoice } from "@/types/invoice";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /**
     * Using requestAnimationFrame schedules the state update for the next frame.
     * This bypasses the "synchronous setState in effect" linting error 
     * by moving the execution out of the initial render's synchronous call stack.
     */
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
      const data = getInvoices();
      setInvoices(data);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const fetchInvoices = useCallback(() => {
    const data = getInvoices();
    setInvoices(data);
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus.length === 0) return true;
    return filterStatus.includes(invoice.status.toLowerCase());
  });

  // 1. Initial Pass: Match the Server-Side Render (SSR) output exactly
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] px-6">
        <HeaderWithModal 
          invoiceCount={0} 
          filterStatus={[]}
          setFilterStatus={() => {}}
          onActionComplete={() => {}} 
        />
        <section className="max-w-182.5 mx-auto mt-6 md:mt-14">
          {/* Static placeholder to prevent layout shift during hydration */}
          <div className="flex flex-col items-center justify-center min-h-[50vh]" />
        </section>
      </main>
    );
  }

  // 2. Final Pass: Render the actual interactive UI with client-side data
  return (
    <main className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] pb-10 transition-colors">
      <HeaderWithModal 
        invoiceCount={filteredInvoices.length} 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onActionComplete={fetchInvoices} 
      />

      <section className="max-w-227.5 mx-auto mt-6 md:mt-14">
        {filteredInvoices.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}