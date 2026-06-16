import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 md:gap-10 min-h-[50vh] px-6 text-center">
      
      {/* Image */}
      <div className="relative w-full max-w-60 md:max-w-75">
        <Image
          src="/empty.png"
          alt="No invoices"
          width={600}
          height={600}
          className="object-cover w-full h-auto"
        />
      </div>

      {/* Text */}
      <div className="max-w-65 md:max-w-[320px] flex flex-col gap-3 md:gap-4">
        
        <h2 className="text-xl md:text-2xl font-bold dark:text-white tracking-tight">
          There is nothing here
        </h2>

        <p className="text-[#888EB0] dark:text-[#DFE3FA] text-sm leading-relaxed">
          Create an invoice by clicking the{" "}
          <span className="font-bold">New Invoice</span> button and get started
        </p>

      </div>

    </div>
  );
};