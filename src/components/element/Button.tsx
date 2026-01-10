type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'black';

type ButtonProps = {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: `
    min-w-[113px] h-[40px]
    rounded-[14px]
    px-[14px] gap-2
    text-sm
    focus-visible:pl-[28px]
    focus-visible:min-w-[127px]
  `,
  md: `
    min-w-[131px] h-[44px]
    rounded-[16px]
    px-[16px] gap-2.5
    text-base
    focus-visible:pl-[30px]
    focus-visible:min-w-[147px]
  `,
  lg: `
    min-w-[135px] h-[52px]
    rounded-[18px]
    px-[16px] gap-3
    text-base
    focus-visible:pl-[32px]
    focus-visible:min-w-[155px]
  `,
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-500 text-white
    hover:bg-blue-400
    active:bg-[#0062cc]
    disabled:bg-[#c2dfff]
    focus-visible:after:bg-white
    shadow-[0px_8px_20px_rgba(0,0,0,0.05),0px_2px_6px_rgba(0,0,0,0.03)]
    before:absolute before:inset-0 before:rounded-[14px]
    before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.7),inset_0px_-2px_3px_rgba(0,0,0,0.1)]
  `,
  secondary: `
    bg-[#DBECFF] text-[#0062cc]
    hover:bg-[#c2dfff]
    active:bg-[#8FC4FF]
    disabled:text-[#8FC4FF]
    focus-visible:after:bg-[#0062cc]
    shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_2px_6px_rgba(0,0,0,0.15)]
    before:absolute before:inset-0 before:rounded-[14px]
    before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.7),inset_0px_-2px_3px_rgba(0,0,0,0.1)]
  `,
  black: `
    bg-[#383838] text-white
    hover:bg-[#666666]
    active:bg-[#262626]
    disabled:bg-[#A6A6A6]
    focus-visible:after:bg-white
    shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_2px_6px_rgba(0,0,0,0.15)]
    before:absolute before:inset-0 before:rounded-[14px]
    before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.7),inset_0px_-2px_3px_rgba(0,0,0,0.1)]
  `,
};

export default function Button({
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  size = 'sm',
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
    disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-sf-medium
        relative
        transition-all  duration-200 ease-out
        focus-visible:outline-none
        focus-visible:after:content-['']
        focus-visible:after:absolute
        focus-visible:after:left-3.5
        focus-visible:after:w-1.5
        focus-visible:after:h-1.5
        focus-visible:after:rounded-full
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
