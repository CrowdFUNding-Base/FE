type CheckboxProps = {
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

export function Checkbox({
  checked = false,
  disabled = false,
  onChange,
}: CheckboxProps) {
  return (
    <label className="group inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />

      <span
        className={`
          w-[22px] h-[22px]
          rounded-[4px]
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
