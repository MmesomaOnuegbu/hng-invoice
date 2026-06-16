import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant: "primary" | "secondary" | "gray" | "dark" | "danger" | "ghost";
  onClick?: () => void;
  icon?: ReactNode;
  type?: "button" | "submit";
  form?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant,
  onClick,
  icon,
  type = "button",
  form,
  className = "",
  fullWidth = false,
  disabled = false,
}: ButtonProps) => {

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold text-[12px] md:text-[15px] transition-all duration-300 rounded-full h-10 md:h-14 tracking-tight whitespace-nowrap";

  const variants = {
    primary: "bg-[#7C5DFA] text-white px-4 md:px-6 hover:bg-[#9277FF]",
    secondary: "bg-[#7C5DFA] text-white px-4 md:px-6 hover:bg-[#9277FF]",
    gray: "bg-[#F9FAFE] text-[#7E88C3] px-4 md:px-6 hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-[#DFE3FA] dark:hover:bg-white dark:hover:text-[#7E88C3]",
    dark: "bg-[#373B53] text-[#888EB0] px-4 md:px-6 hover:bg-[#0C0E16] dark:text-[#DFE3FA] dark:hover:bg-[#1E2139]",
    danger: "bg-[#EC5757] text-white px-4 md:px-6 hover:bg-[#FF9797]",
    ghost: "bg-[#F9FAFE] text-[#7E88C3] px-6 dark:hover:bg-black/50 hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-[#DFE3FA] mt-4",
  };

  return (
    <button
      type={type}
      form={form}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
    >
      {icon && (
        <span className="flex items-center justify-center w-4 h-4 md:w-8 md:h-8 shrink-0">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </button>
  );
};