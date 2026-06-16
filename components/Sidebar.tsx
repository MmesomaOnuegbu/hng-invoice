"use client";

import Image from "next/image";
import Link from "next/link";
import Darkmode from "./Shared/darkmoade";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-999 flex h-20 w-full flex-row items-center justify-between bg-[#373B53] dark:bg-[#1E2139] md:h-screen md:w-25.75 md:flex-col md:rounded-r-[20px]">
      
      {/* Logo */}
      <Link 
        href="/" 
        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-r-[20px] bg-[#7C5DFA] md:h-25.75 md:w-full group"
      >
        <div className="absolute bottom-0 h-1/2 w-full rounded-tl-[20px] bg-[#9277FF] transition-all duration-300 group-hover:h-full" />
        <div className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
            <path
              fill="#FFF"
              fillRule="evenodd"
              d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
            />
          </svg>
        </div>
      </Link>

      {/* Right / Bottom Section */}
      <div className="flex flex-row items-center md:w-full md:flex-col">
        
        {/* Dark Mode */}
        <div className="flex items-center justify-center px-4 md:px-0 md:py-8">
          <Darkmode />
        </div>

        {/* Divider */}
        <div className="h-20 w-px bg-[#494E6E] md:h-px md:w-full" />

        {/* Avatar */}
        <div className="flex items-center justify-center px-4 md:px-0 md:py-8">
          <div className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-transparent hover:border-[#7C5DFA] transition-colors">
            <Image
              src="/avatar.png"
              alt="User"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </aside>
  );
}