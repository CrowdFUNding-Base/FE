type InputVariant = | 'default' | 'search';

type InputType = 'text' | 'password' | 'email' | 'search';

type InputFieldProps = {
  label?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  variant?: InputVariant;
  type?: InputType;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  error?: boolean;
  disabled?: boolean;
};

const variantClasses: Record<InputVariant, string> = {
  default: `
    border border-[#A6A6A6]
  `,
  search: `
    border border-transparent
  `,
};

const disabledClasses = `
  bg-[#F9F9F9]
  border border-[#F2F2F2]
  cursor-not-allowed
`;

export default function InputField({
  label = 'Input Label',
  helperText = '',
  placeholder = 'input',
  value,
  onChange,
  type = 'text',
  variant = 'default',
  leftIcon,
  rightIcon,
  error = false,
  disabled = false,
}: InputFieldProps) {

  const isFilled = Boolean(value && value.length > 0);
  const iconColor = (() => {
    if (disabled) return '#F2F2F2';
    if (error) return '#FFAA33';
    return '#666666';
  })();
  return (
    <div className="flex flex-col gap-1.5 w-[256px]">
      {/* Label */}
      <label className="
        text-base
        leading-5
        tracking-[-0.02em]
        font-sf-semibold
        text-black
      ">
        {label}
      </label>

      {/* Input */}
      <div
        className={`
          group
          flex items-center gap-2
          h-11
          px-3.5 py-3
          rounded-[14px]
          transition-all duration-200 ease-out
          shadow-[0px_2px_6px_rgba(0,0,0,0.03)]

          ${isFilled ? "bg-white" : "bg-[#EDEDED]"}

          ${
            error
              ? "border border-[#FFD599] focus-within:outline-4 focus-within:outline-[#FFD599]"
              : "focus-within:outline-4 focus-within:outline-[#C2DFFF]"
          }

          focus-within:bg-white
          focus-within:border-transparent

          ${variantClasses[variant]}
          ${disabled ? disabledClasses : ''}
          ${!disabled && `
          focus-within:bg-white
          focus-within:outline-4
          focus-within:outline-[#C2DFFF]
          focus-within:border-transparent
          `}
          `}
        >
        {leftIcon && (
          <span
            className="w-6 h-6 flex items-center justify-center"
            style={{ color: iconColor }}
          >
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full bg-transparent
            outline-none
            text-sm
            font-sf-medium
            text-[#262626]
            placeholder:text-neutral-400
            disabled:cursor-not-allowed
          "
        />
        {rightIcon && (
          <span
            className="w-6 h-6 flex items-center justify-center"
            style={{ color: iconColor }}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper */}
      <span
        className={`
        text-xs
        leading-4
        font-sf-medium
        ${error ? "text-[#FFAA33]" : "text-neutral-500"}
        `}
      >
        {helperText}
      </span>
    </div>
  );
}