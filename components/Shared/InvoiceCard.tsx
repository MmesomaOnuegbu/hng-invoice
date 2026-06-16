import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import { StatusBadge } from "../StatusBadge";
import { Invoice } from "@/types/invoice";

export const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  return (
    <Link href={`/invoice/${invoice.id}`}>
      <div
        className="group flex flex-col md:flex-row items-center justify-between 
        bg-white dark:bg-[#1E2139] 
        p-4 md:p-6 rounded-lg mb-4 cursor-pointer transition-all duration-300
        border border-transparent hover:border-[#7C5DFA]
        shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)]"
      >

        {/* Left Section */}
        <div className="flex justify-between items-center w-full md:w-auto gap-4 md:gap-8">
          <span className="font-bold uppercase text-[13px] md:text-[15px] dark:text-white">
            <span className="text-[#7E88C3]">#</span>{invoice.id}
          </span>

          <span className="text-[#888EB0] dark:text-[#DFE3FA] text-xs md:text-sm hidden md:block">
            Due{" "}
            {new Date(invoice.paymentDue).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <span className="text-[#858BB2] dark:text-white text-xs md:text-sm md:w-32 truncate">
            {invoice.clientName}
          </span>
        </div>

        {/* Right Section */}
        <div className="flex justify-between items-center w-full md:w-auto mt-3 md:mt-0 gap-4 md:gap-8">
          
          <div className="flex flex-col md:flex-row items-baseline md:items-center gap-2 md:gap-4">
            <span className="text-[#888EB0] text-xs md:text-sm md:hidden font-medium">
              Due {invoice.paymentDue}
            </span>

            <span className="font-bold text-base md:text-lg dark:text-white">
              £ {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <StatusBadge status={invoice.status} />
            <BiChevronRight className="hidden md:block w-5 h-5 text-[#7C5DFA]" />
          </div>
        </div>

      </div>
    </Link>
  );
};