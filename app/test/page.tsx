"use client";
import { useState } from 'react';
import Image from "next/image";
import InputField from "@/components/element/InputField";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Home() {
    const [value, setValue] = useState('');
    const [show, setShow] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white  sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-sf-semibold leading-10 tracking-tight text-black ">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 ">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium text-black sm:flex-row">
          <InputField
            label="Email"
            placeholder="you@example.com"
            helperText="We'll never share your email"
            variant="default"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error
            />
            <InputField
            type={show ? 'text' : 'password'}
            placeholder="Password"
            rightIcon={
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                >
                    {show ? <IoEyeOff /> : <IoEye />}
                </button>
            }
            />
          
        </div>
      </main>
    </div>
  );
}
