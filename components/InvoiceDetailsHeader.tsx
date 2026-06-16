"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for redirect after delete
import { FiChevronLeft } from "react-icons/fi";
import { StatusBadge } from "./StatusBadge";
import { InvoiceForm } from "./EditAndCreate";
import { Invoice } from "@/types/invoice";
import { deleteInvoice, markAsPaid } from "@/lib/actions";
import { Button } from "./Shared/Button";

interface HeaderProps {
  invoice: Invoice;
  onActionComplete: () => void; // Add this
}

export const InvoiceDetailsHeader = ({ invoice, onActionComplete }: HeaderProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  if (!invoice) return null;

  const handleDelete = async () => {
    await deleteInvoice(invoice.id);
    setIsDeleteModalOpen(false);
    router.push("/"); // Redirect home after deleting
  };

  const handleMarkAsPaid = async () => {
    await markAsPaid(invoice.id);
    onActionComplete(); // Refresh the detail page UI
  };

  const renderActionButtons = () => (
    <>
      <Button variant="gray" onClick={() => setIsEditOpen(true)}>
        Edit
      </Button>
      <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
        Delete
      </Button>
      {invoice.status !== "paid" && (
        <Button variant="secondary" onClick={handleMarkAsPaid}>
          Mark as Paid
        </Button>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 pt-6 md:pt-10 sm:pt-0">
      
      <Link
        href="/"
        className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-bold dark:text-white hover:text-[#7E88C3] transition-colors w-fit"
      >
        <span className="text-[#7C5DFA]">
          <FiChevronLeft strokeWidth={4} />
        </span>
        Go back
      </Link>

      <div className="flex items-center justify-between bg-white dark:bg-[#1E2139] p-4 md:p-6 md:px-8 rounded-lg shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-5">
          <span className="text-[#858BB2] text-xs md:text-sm font-medium">
            Status
          </span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="hidden md:flex items-center gap-2">
          {renderActionButtons()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-[#1E2139] py-4 flex items-center justify-end px-4 gap-2 z-40 shadow-[0_-8px_20px_rgba(72,84,159,0.1)]">
        <div className="flex gap-2 flex-wrap justify-end">
          {renderActionButtons()}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1E2139] p-6 md:p-12 rounded-lg max-w-120 w-full shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white mb-3">
              Confirm Deletion
            </h2>
            <p className="text-[#888EB0] dark:text-[#DFE3FA] text-sm leading-relaxed mb-6 md:mb-8">
              Are you sure you want to delete invoice #{invoice.id}? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="gray" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <InvoiceForm
          invoice={invoice}
          mode="edit"
          onClose={() => {
            setIsEditOpen(false);
            onActionComplete(); // Refresh UI after editing
          }}
        />
      )}
    </div>
  );
};