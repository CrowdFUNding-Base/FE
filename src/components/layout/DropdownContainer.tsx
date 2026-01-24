type DropdownContainerProps = {
  children: React.ReactNode;
};

export default function DropdownContainer({ children }: DropdownContainerProps) {
  return (
    <div
      className="
        w-auto
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
