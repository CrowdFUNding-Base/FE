'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { cn } from '@/utils/helpers/cn';


type DropdownContextType = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error('Dropdown components must be wrapped in <DropdownRoot />');
  }
  return ctx;
}


function DropdownRoot({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}


type DropdownButtonProps = {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: boolean;
  className?: string;
};

function DropdownButton({
  label,
  iconLeft,
  iconRight = true,
  className,
}: DropdownButtonProps) {
  const { open, toggle } = useDropdown();

  return (
    <button
      onClick={toggle}
      className={cn(
        `
        group flex items-center
        w-56.75 h-8.5
        px-2 gap-2.5
        bg-white
        text-sm font-sf-medium text-[#1A1A1A]
        hover:bg-[#F2F2F2]
        active:bg-[#E0E0E0]
        transition-all duration-75 ease-out
      `,
    open
      ? 'rounded-t-[10px]'
      : 'rounded-[10px]',
        className
      )}
    >
      {iconLeft && (
        <span className="flex items-center justify-center w-4 h-4 text-blue-500">
          {iconLeft}
        </span>
      )}

      <span className="flex-1 text-left text-sm font-sf-medium">
        {label}
      </span>

      {iconRight && (
        <IoChevronBack
          className={cn(
            'w-4 h-4 transition-transform duration-200 text-[#666666]',
            open && '-rotate-90'
          )}
        />
      )}
    </button>
  );
}


type DropdownMenuProps = {
  children: React.ReactNode;
  className?: string;
};

function DropdownMenu({ children, className }: DropdownMenuProps) {
  const { open } = useDropdown();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div
      style={{ height: `${height}px` }}
      className={cn(
        `
        text-sm font-sf-medium text-[#1A1A1A]
        w-56.75
        overflow-hidden
        transition-all duration-300 ease-in-out
        origin-top
      `,
        className
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          `
          rounded-b-[12.5px]
          p-0.75
          bg-white
          shadow-[0px_4px_6px_rgba(0,0,0,0.12)]
          flex flex-col items-stretch gap-0.5
        `
        )}
      >
        {children}
      </div>
    </div>
  );
}

type DropdownItemProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
};

function DropdownItem({
  children,
  href,
  className,
  onClick,
}: DropdownItemProps) {
  const { close } = useDropdown();

  if (href) {
    return (
      <a
        href={href}
        className={cn(
        `
        w-full
        px-3 py-2
        text-left
        rounded-lg
        text-sm font-sf-medium text-[#1A1A1A]
        hover:bg-[#F2F2F2]
        active:bg-[#E0E0E0]
        transition-colors
        `,
        className
      )}
    >
      {children}
      </a>
    );
  }

  return (
    <button
      onClick={() => {
        onClick?.();
        close();
      }}
      className={cn(
        `
        w-full
        px-3 py-2
        text-left
        rounded-lg
        text-sm font-sf-medium text-[#1A1A1A]
        hover:bg-[#F2F2F2]
        active:bg-[#E0E0E0]
        transition-colors
        `,
        className
      )}
    >
      {children}
    </button>
  );
}

/* ================= EXPORT ================= */

export {
  DropdownRoot,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
};
