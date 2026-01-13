type DropdownMenuProps = {
  children: React.ReactNode;
};

export default function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div
      className="
        w-56
        rounded-[12.5px]
        p-[3px]
        bg-white
        shadow-[0px_4px_6px_rgba(0,0,0,0.12)]
        flex flex-col
        gap-0.5
      "
    >
      {children}
    </div>
  );
}
