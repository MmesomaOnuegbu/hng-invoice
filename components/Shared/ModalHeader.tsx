"use client";

import { useState } from "react";
import { MainHeader } from "../Header";
import { InvoiceForm } from "../EditAndCreate";

interface HeaderWithModalProps {
  invoiceCount: number;
  filterStatus: string[];
  setFilterStatus: (status: string[]) => void;
  onActionComplete: () => void; // Added this
}

export function HeaderWithModal({ 
  invoiceCount, 
  filterStatus, 
  setFilterStatus,
  onActionComplete // Destructure it here
}: HeaderWithModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpenForm = () => setOpen(true);
  
  const handleCloseForm = () => {
    setOpen(false);
    // Refresh the invoice list whenever the modal is closed
    // This ensures any new "Save" or "Save as Draft" data shows up
    onActionComplete(); 
  };

  return (
    <>
      <MainHeader 
        invoiceCount={invoiceCount}
        onOpenForm={handleOpenForm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      {open && (
        <InvoiceForm
          mode="create"
          onClose={handleCloseForm}
        />
      )}
    </>
  );
}