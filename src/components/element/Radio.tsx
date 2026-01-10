type RadioProps = {
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

export function Radio({
  name,
  value,
  checked = false,
  disabled = false,
  onChange,
}: RadioProps) {
  return (
    <label className="group inline-flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />

      <span
        className={`
          w-5.5 h-5.5
          rounded-full
          box-border
          transition-all duration-150

          bg-white
          border-2 border-[#A6A6A6]

          /* hover */
          group-hover:bg-[#E0E0E0]

          /* active / checked */
          peer-active:bg-[#DBECFF]
          peer-active:border-[6px]
          peer-active:border-[#007AFF]

          peer-checked:bg-[#DBECFF]
          peer-checked:border-[6px]
          peer-checked:border-[#007AFF]

          /* focus */
          peer-focus-visible:shadow-[0_0_4px_4px_#8FC4FF5C]

          /* disabled */
          peer-disabled:border-[#E0E0E0]
          peer-disabled:bg-white
          peer-disabled:cursor-not-allowed
        `}
      />
    </label>
  );
}
