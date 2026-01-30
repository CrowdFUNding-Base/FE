"use client";

import { useState } from "react";
import InputField from "@/components/element/InputField";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import { Loader2 } from "lucide-react";

interface CampaignFormProps {
    onSubmit?: (data: CampaignFormData) => void;
    className?: string;
    isLoading?: boolean;
    loadingText?: string;
}

export interface CampaignFormData {
    title: string;
    creator: string;
    description: string;
    targetAmount: string;
    endDate: string;
}

export default function CampaignForm({ 
    onSubmit, 
    className, 
    isLoading = false,
    loadingText = "Creating..."
}: CampaignFormProps) {
    const [formData, setFormData] = useState<CampaignFormData>({
        title: "",
        creator: "",
        description: "",
        targetAmount: "",
        endDate: "",
    });

    const [targetAmountError, setTargetAmountError] = useState(false);

    const handleChange = (field: keyof CampaignFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        if (field === "targetAmount") {
            // Check if value contains only numbers
            const isValid = /^\d*$/.test(value);
            setTargetAmountError(!isValid && value !== "");
        }
        
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isLoading) return;
        onSubmit?.(formData);
    };

    // Form validation
    const isFormValid = 
        formData.title.trim() !== "" &&
        formData.creator.trim() !== "" &&
        formData.targetAmount.trim() !== "" &&
        !targetAmountError &&
        Number(formData.targetAmount) > 0;

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "flex flex-col justify-center items-center gap-3 w-full p-6 rounded-[20px] bg-white shadow-[0_8px_20px_0_rgba(0,0,0,0.15)]",
                className
            )}
        >
            {/* Campaign Title */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Campaign Title"
                    placeholder="What Campaign are you raising for?"
                    type="text"
                    value={formData.title}
                    onChange={handleChange("title")}
                    variant="default"
                    disabled={isLoading}
                />
            </div>

            {/* Creator Name */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Creator Name"
                    placeholder="Your Name"
                    type="text"
                    value={formData.creator}
                    onChange={handleChange("creator")}
                    variant="default"
                    disabled={isLoading}
                />
            </div>

            {/* Description */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Description"
                    placeholder="Describe your campaign"
                    value={formData.description}
                    onChange={handleChange("description")}
                    variant="default"
                    multiline={true}
                    rows={4}
                    disabled={isLoading}
                />
            </div>

            {/* Target Amount */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Target Amount (IDRX)"
                    placeholder="Enter target amount"
                    type="text"
                    value={formData.targetAmount}
                    onChange={handleChange("targetAmount")}
                    variant="default"
                    error={targetAmountError}
                    helperText={targetAmountError ? "Only use number" : ""}
                    disabled={isLoading}
                />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-sf-medium text-zinc-700">
                    End Date (Optional)
                </label>
                <input
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange("endDate")}
                    disabled={isLoading}
                    className={cn(
                        "w-full px-4 py-3 rounded-lg",
                        "border border-[#A6A6A6]",
                        "font-sf-regular text-base text-zinc-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "transition-all",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                />
            </div>

            {/* Create Campaign Button */}
            <div className="flex justify-center items-center self-stretch mt-3">
                <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {loadingText}
                        </span>
                    ) : (
                        "Create Campaign"
                    )}
                </Button>
            </div>
        </form>
    );
}

