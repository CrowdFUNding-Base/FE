"use client";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";

type DropdownButtonProps = {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: boolean;
};

export default function DropdownButton({
  label,
  iconLeft,
  iconRight = true,
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="
        group
        flex items-center
        w-56.75 h-8.5
        px-2
        gap-2.5
        rounded-[10px]

        bg-white
        hover:bg-[#F2F2F2]
        active:bg-[#E0E0E0]

        transition-all
        duration-200
        ease-out
      "
    >
      {iconLeft && (
        <span
          className="
            flex items-center justify-center
            w-4 h-4
            text-blue-500
          "
        >
          {iconLeft}
        </span>
      )}

      <span className="flex-1 text-left text-sm font-sf-medium">
        {label}
      </span>

      {iconRight && (
        <IoChevronBack
          className={`
            w-4 h-4
            transition-transform duration-200
            ${open ? "-rotate-90" : ""}
          `}
        />
      )}
    </button>
  );
}
