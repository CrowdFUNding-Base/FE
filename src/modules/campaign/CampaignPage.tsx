"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import { Bookmark, Loader2 } from "lucide-react";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import Image from "next/image";
import ProgressBar from "@/components/element/ProgressBar";
import { useCampaign, formatIDRX, formatIDRXCurrency, calculateProgress } from "@/hooks/useCrowdfunding";

interface CampaignPageProps {
    campaignId: string;
}

const CampaignPage = ({ campaignId }: CampaignPageProps) => {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch campaign data from backend API
    const { data: campaignData, isLoading, error } = useCampaign(Number(campaignId));

    // Get campaign from response (backend returns { campaign, vault })
    const campaign = campaignData?.campaign;

    // Check if current user is the campaign owner
    const isOwner = isConnected && campaign && address?.toLowerCase() === campaign.owner?.toLowerCase();

    // Loading state
    if (isLoading) {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                        <p className="text-lg font-sf-semibold text-zinc-900">Loading campaign...</p>
                    </Container>
                </section>
            </main>
        );
    }

    // Error or not found state
    if (error || !campaign) {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-16">
                        <p className="text-lg font-sf-semibold text-zinc-900">Campaign not found</p>
                        <Button variant="primary" onClick={() => router.push('/home')}>
                            Back to Home
                        </Button>
                    </Container>
                </section>
            </main>
        );
    }

    // Calculate display values (using camelCase from API)
    const raised = formatIDRX(campaign.balance);
    const needed = formatIDRX(campaign.targetAmount);
    const progress = calculateProgress(campaign.balance, campaign.targetAmount);

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative overflow-hidden bg-[#FAFAFA]">
                <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-96 max-h-screen">
                    <Gradient className={cn(
                        "-translate-y-3/4 blur-2xl"
                    )} />
                        <div className="relative flex flex-col items-center min-h-screen pt-16 w-full">
                        {/* Back Button */}
                            <div className="sticky top-0 z-50 flex flex-row items-center w-full">
                                <Button 
                                    variant={"black"}
                                    size={"sm"}
                                    onClick={() => router.back()}
                                    className="absolute left-0"
                                >
                                    ←
                                </Button>
                                 {/* Header */}
                                <div className="flex-1 text-center my-3 ">
                                    <h1 className="text-lg font-sf-semibold text-black">Donasi</h1>
                                </div>
                            </div>

                       {/* Content Area */}
                        <div ref={scrollContainerRef} className="flex flex-col overflow-y-auto scrollbar-hide w-full gap-6 pb-24">
                        <div className={cn(
                            "flex flex-col items-center pt-6 w-auto max-w-sm justify-center gap-6 mx-auto"
                        )}>
                            <Image
                            src="/assets/images/placeholder-2.webp"
                            alt={campaign.name}
                            width={335}
                            height={180}
                            className="object-cover rounded-[20px]"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between gap-3">
                            <h2 className="text-2xl font-sf-semibold text-black">
                                {campaign.name}
                            </h2>
                            <Bookmark className="w-6 h-6 text-[#B6B6B6]" />
                        </div>
                        <div className="flex">
                            <ProgressBar collected={raised} total={needed} />
                        </div>
                        <div className="flex flex-row justify-between -mt-3 gap-1">
                            <h3 className="font-sf-semibold text-black text-lg">
                                Creator
                            </h3>
                            <p className="text-zinc-700 text-sm font-sf-regular">
                                {campaign.creatorName || 'Unknown'}
                            </p>
                        </div>
                        {campaign.description && (
                            <div className="flex flex-col gap-2">
                                <h3 className="font-sf-semibold text-black text-lg">
                                    Deskripsi
                                </h3>
                                <p className="text-black text-sm font-sf-regular">
                                    {campaign.description}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col gap-3 bg-white/80 p-4 rounded-xl">
                            <h3 className="font-sf-semibold text-black text-lg">
                                Campaign Info
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600 font-sf-regular">Raised:</span>
                                <span className="font-sf-medium text-black">{formatIDRXCurrency(campaign.balance)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600 font-sf-regular">Target:</span>
                                <span className="font-sf-medium text-black">{formatIDRXCurrency(campaign.targetAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600 font-sf-regular">Progress:</span>
                                <span className="font-sf-medium text-blue-400">{progress}%</span>
                            </div>
                        </div>
                        </div>

                        {/* Bottom Action Button */}
                        <div className="fixed -bottom-0.5 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
                            <div
                                className={cn(
                                    'h-21 px-8 pt-5 pb-5',
                                    'rounded-t-[35px] bg-white/70',
                                    'shadow-[0px_-3px_10px_0px_rgba(0,0,0,0.15)]',
                                    'backdrop-blur-xl'
                                )}
                            >
                                <div className="flex flex-col gap-3 w-full items-center">
                                    {isOwner ? (
                                        <Button
                                            variant="primary"
                                            size="md"
                                            onClick={() => router.push(`/campaign/${campaignId}/withdraw`)}
                                            className="w-full max-w-md bg-red-600 hover:bg-red-700"
                                        >
                                            Withdraw Funds
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="md"
                                            onClick={() => router.push(`/campaign/${campaignId}/donate`)}
                                            className="w-full max-w-md"
                                        >
                                            Donate Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
};

export default CampaignPage;