/* eslint-disable @typescript-eslint/no-explicit-any */
import { Invoice } from "@/types/invoice";

export const InvoiceMainInfo = ({ invoice }: { invoice: Invoice | null }) => {
  if (!invoice) return <div className="animate-pulse p-6 text-[#7C5DFA] font-bold">Loading...</div>;

  return (
    <div className="bg-white dark:bg-[#1E2139] p-4 md:p-12 mt-6 rounded-lg shadow-sm mb-24 md:mb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 mb-8 md:mb-12">
        <div>
          <h1 className="text-lg md:text-xl font-bold dark:text-white uppercase">
            <span className="text-[#7E88C3]">#</span>{invoice.id}
          </h1>
          <p className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm">
            {invoice.description}
          </p>
        </div>

        <div className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm md:text-right leading-relaxed font-medium">
          {invoice.senderAddress?.street}<br />
          {invoice.senderAddress?.city}<br />
          {invoice.senderAddress?.postCode}<br />
          {invoice.senderAddress?.country}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        
        <div className="flex flex-col justify-between gap-6 md:gap-8">
          <div>
            <h3 className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm mb-1 md:mb-2">
              Invoice Date
            </h3>
            <p className="font-bold text-base md:text-lg dark:text-white">
              {invoice.createdAt}
            </p>
          </div>

          <div>
            <h3 className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm mb-1 md:mb-2">
              Payment Due
            </h3>
            <p className="font-bold text-base md:text-lg dark:text-white">
              {invoice.paymentDue}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm mb-1 md:mb-2">
            Bill To
          </h3>
          <p className="font-bold text-base md:text-lg dark:text-white mb-1 md:mb-2">
            {invoice.clientName}
          </p>
          <div className="text-[#7E88C3] dark:text-[#DFE3FA] text-[11px] md:text-xs leading-relaxed">
            {invoice.clientAddress?.street}<br />
            {invoice.clientAddress?.city}<br />
            {invoice.clientAddress?.postCode}<br />
            {invoice.clientAddress?.country}
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-[#7E88C3] dark:text-[#DFE3FA] text-xs md:text-sm mb-1 md:mb-2">
            Sent to
          </h3>
          <p className="font-bold text-base md:text-lg dark:text-white break-all">
            {invoice.clientEmail}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-4 md:p-8">
        
        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-5">
          {invoice.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <h4 className="font-bold dark:text-white text-sm mb-1">
                  {item.name}
                </h4>
                <p className="text-[#7E88C3] font-bold text-xs">
                  {item.quantity} x £ {item.price.toFixed(2)}
                </p>
              </div>
              <span className="font-bold dark:text-white text-sm">
                £ {item.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <table className="hidden md:table w-full text-left">
          <thead>
            <tr className="text-[#7E88C3] text-xs">
              <th className="pb-8 font-medium">Item Name</th>
              <th className="pb-8 font-medium text-center">QTY.</th>
              <th className="pb-8 font-medium text-right">Price</th>
              <th className="pb-8 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr key={i} className="font-bold text-sm dark:text-white">
                <td className="py-4">{item.name}</td>
                <td className="py-4 text-center text-[#7E88C3]">
                  {item.quantity}
                </td>
                <td className="py-4 text-right text-[#7E88C3]">
                  £ {item.price.toFixed(2)}
                </td>
                <td className="py-4 text-right">
                  £ {item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-[#373B53] dark:bg-[#0C0E16] text-white p-4 md:px-8 md:py-6 rounded-b-lg flex justify-between items-center">
        <span className="text-xs md:text-sm font-light">Amount Due</span>
        <span className="text-xl md:text-2xl font-bold">
          £ {invoice.total.toFixed(2)}
        </span>
      </div>

    </div>
  );
};