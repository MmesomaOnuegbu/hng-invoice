"use client";

import { useState, useRef, useEffect } from "react";
import { BiChevronDown, BiPlus } from "react-icons/bi";
import { Button } from "./Shared/Button";

interface MainHeaderProps {
  invoiceCount: number;
  onOpenForm: () => void;
  filterStatus: string[];
  setFilterStatus: (status: string[]) => void;
}

export const MainHeader = ({ 
  invoiceCount, 
  onOpenForm, 
  filterStatus = [], 
  setFilterStatus = () => {} 
}: MainHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statuses = ["Draft", "Pending", "Paid"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStatus = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (filterStatus.includes(normalizedStatus)) {
      setFilterStatus(filterStatus.filter((s) => s !== normalizedStatus));
    } else {
      setFilterStatus([...filterStatus, normalizedStatus]);
    }
  };

  return (
    <header className="flex items-center justify-between w-full max-w-227.5 mx-auto pt-20 md:pt-14 pb-4 md:pb-14 ">
      
      {/* Left */}
      <div>
        <h1 className="text-[20px] md:text-3xl lg:text-4xl font-bold text-[#0C0E16] dark:text-white tracking-tight">
          Invoices
        </h1>
        <p className="text-[#888EB0] dark:text-gray-400 text-[12px] md:text-sm">
          <span className="hidden md:inline">There are </span>
          {invoiceCount === 0 ? "no" : invoiceCount} 
          <span className="hidden md:inline"> total</span> invoices
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-10">
        
        {/* Filter */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 md:gap-3 font-bold text-[12px] md:text-[15px] text-[#0C0E16] dark:text-white"
          >
            Filter
            <span className="hidden md:inline">by status</span>
            <BiChevronDown 
              className={`w-4 h-4 text-[#7C5DFA] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-4 w-40 bg-white dark:bg-[#252945] shadow-xl rounded-lg p-4 md:p-6 z-50 flex flex-col gap-4">
              {statuses.map((status) => (
                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 bg-[#DFE3FA] dark:bg-[#1E2139] rounded-sm checked:bg-[#7C5DFA] border border-transparent transition-all cursor-pointer"
                      checked={filterStatus.includes(status.toLowerCase())}
                      onChange={() => handleToggleStatus(status)}
                    />
                    <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[12px] md:text-[15px] font-bold text-[#0C0E16] dark:text-white group-hover:text-[#7C5DFA] transition-colors">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        <Button
          variant="primary"
          onClick={onOpenForm}
          icon={
            <div className="bg-white rounded-full p-1.5">
              <BiPlus className="w-4 h-4 text-[#7C5DFA]" />
            </div>
          }
        >
          New
          <span className="hidden md:inline ml-1">Invoice</span>
        </Button>

      </div>
    </header>
  );
};