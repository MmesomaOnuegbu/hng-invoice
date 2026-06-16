interface StatusBadgeProps {
  status: "paid" | "pending" | "draft";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = {
    paid: "bg-green-50 text-[#33D69F] dark:bg-[#33D69F]/10",
    pending: "bg-orange-50 text-[#FF8F00] dark:bg-[#FF8F00]/10",
    draft: "bg-gray-100 text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]",
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center gap-2 
        px-3 md:px-4 py-2 md:py-3 
        rounded-md font-bold capitalize 
        text-[11px] md:text-sm 
        whitespace-nowrap shrink-0
        transition-colors
        ${statusStyles[status]}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-current shrink-0" />
      {status}
    </div>
  );
};