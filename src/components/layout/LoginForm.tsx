"use client";

import { useState } from "react";
import InputField from "@/components/element/InputField";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";

interface LoginFormProps {
    variant?: "login" | "register";
    onSubmit?: (data: FormData) => void;
    className?: string;
}

interface FormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export default function LoginForm({ variant = "login", onSubmit, className }: LoginFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    const handleGoogleLogin = () => {
        console.log("Login with Google");
    };

    const handleWeb3Login = () => {
        console.log("Login with Web3 Wallet");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "flex flex-col justify-center items-center gap-3 w-full p-6 rounded-[20px] bg-white shadow-[0_8px_20px_0_rgba(0,0,0,0.15)]",
                className
            )}
        >
            {/* Siapa Namamu - Only for register */}
            {variant === "register" && (
                <div className="flex justify-center items-center self-stretch">
                    <InputField
                        label="Siapa Namamu"
                        placeholder="input"
                        type="text"
                        value={formData.name}
                        onChange={handleChange("name")}
                        variant="default"
                    />
                </div>
            )}

            {/* Email */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Email"
                    placeholder="input"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    variant="default"
                />
            </div>

            {/* Password */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Password"
                    placeholder="input"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    variant="default"
                />
            </div>

            {/* Konfirmasi Password - Only for register */}
            {variant === "register" && (
                <div className="flex justify-center items-center self-stretch">
                    <InputField
                        label="Konfirmasi Password"
                        placeholder="input"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        variant="default"
                    />
                </div>
            )}

            {/* Divider text */}
            <p className="text-sm text-gray-600 font-sf-regular mt-2">Atau login dengan:</p>

            {/* Social Login Buttons */}
            <div className="flex gap-3 w-full">
                <Button
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex-1"
                >
                    Google
                </Button>
                <Button
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={handleWeb3Login}
                    className="flex-1"
                >
                    Web3 Wallet
                </Button>
            </div>
        </form>
    );
}
