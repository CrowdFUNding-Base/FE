'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/helpers/cn';

const buttonVariants = cva(
  `
    inline-flex items-center justify-center
    font-sf-medium
    relative shrink-0
    transition-all duration-200 ease-out
    disabled:cursor-not-allowed
    [&_svg]:shrink-0
  `,
  {
    variants: {
      size: {
        rounded: `
          w-fit h-10
          rounded-full
          px-[14px] gap-2
          text-sm
        `,
        sm: `
          h-[40px]
          rounded-[14px]
          px-[14px] gap-2
          text-sm
          focus-visible:pl-[28px]
          focus-visible:min-w-[127px]
        `,
        md: `
          h-[44px]
          rounded-[16px]
          px-[16px] gap-2.5
          text-base
          focus-visible:pl-[30px]
          focus-visible:min-w-[147px]
        `,
        lg: `
          h-[52px]
          rounded-[18px]
          px-[16px] gap-3
          text-base
          focus-visible:pl-[32px]
          focus-visible:min-w-[155px]
        `,
        wallet: `
          w-full h-[56px]
          rounded-[16px]
          px-5 gap-2
          text-base
          justify-between
        `,
        tips: `
          h-9
          rounded-xl
          px-3 gap-1.5
          text-sm
        `,
      },
      variant: {
        rounded: `
          bg-blue-50 text-black
          active:bg-blue-100
          disabled:text-neutral-400
          focus-visible:outline-none
          focus-visible:border-1
          focus-visible:border-[#A6A6A6]
        `,
        primary: `
          bg-blue-500 text-white
          hover:bg-blue-400
          active:bg-[#0062cc]
          disabled:bg-[#c2dfff]
          focus-visible:after:bg-white
          focus-visible:outline-none
          focus-visible:after:content-['']
          focus-visible:after:absolute
          focus-visible:after:left-3.5
          focus-visible:after:w-1.5
          focus-visible:after:h-1.5
          focus-visible:after:rounded-full
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
          focus-visible:outline-none
          focus-visible:after:content-['']
          focus-visible:after:absolute
          focus-visible:after:left-3.5
          focus-visible:after:w-1.5
          focus-visible:after:h-1.5
          focus-visible:after:rounded-full
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
          focus-visible:outline-none
          focus-visible:after:content-['']
          focus-visible:after:absolute
          focus-visible:after:left-3.5
          focus-visible:after:w-1.5
          focus-visible:after:h-1.5
          focus-visible:after:rounded-full
          shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_2px_6px_rgba(0,0,0,0.15)]
          before:absolute before:inset-0 before:rounded-[14px]
          before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.7),inset_0px_-2px_3px_rgba(0,0,0,0.1)]
        `,
        wallet: `
          bg-cyan-700 text-cyan-50
          hover:bg-cyan-800
          active:bg-cyan-800
          focus-visible:after:bg-cyan-50
          shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_2px_6px_rgba(0,0,0,0.15)]
          before:absolute before:inset-0 before:rounded-[16px]
          before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.2),inset_0px_-2px_3px_rgba(0,0,0,0.1)]
        `,
        tips: `
          bg-[#2C2C2C] text-white
          hover:bg-[#3A3A3A]
          active:bg-[#1A1A1A]
          shadow-[0px_4px_12px_rgba(0,0,0,0.15)]
        `,
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'primary',
    },
  }
);

type ButtonProps =
  React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size,
      variant,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ size, variant }), className)}
        {...props}
      >
        {leftIcon && <span className="flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
