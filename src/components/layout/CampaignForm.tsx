"use client";

import { useState } from "react";
import InputField from "@/components/element/InputField";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";

interface CampaignFormProps {
    onSubmit?: (data: CampaignFormData) => void;
    className?: string;
}

interface CampaignFormData {
    title: string;
    creator: string;
    description: string;
    targetAmount: string;
    endDate: string;
}

export default function CampaignForm({ onSubmit, className }: CampaignFormProps) {
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
        onSubmit?.(formData);
    };

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
                />
            </div>

            {/* Target Amount */}
            <div className="flex justify-center items-center self-stretch">
                <InputField
                    label="Target Amount"
                    placeholder="Enter target amount"
                    type="text"
                    value={formData.targetAmount}
                    onChange={handleChange("targetAmount")}
                    variant="default"
                    error={targetAmountError}
                    helperText={targetAmountError ? "Only use number" : ""}
                />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-sf-medium text-zinc-700">
                    End Date
                </label>
                <input
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange("endDate")}
                    className={cn(
                        "w-full px-4 py-3 rounded-lg",
                        "border border-[#A6A6A6]",
                        "font-sf-regular text-base text-zinc-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "transition-all"
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
                    disabled={targetAmountError}
                >
                    Create Campaign
                </Button>
            </div>
        </form>
    );
}
