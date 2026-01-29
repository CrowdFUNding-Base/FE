"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import { Bookmark } from "lucide-react";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import Image from "next/image";
import campaignsData from "@/data/campaigns.json";
import ProgressBar from "@/components/element/ProgressBar";

interface Campaign {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    progress: number;
    tags: string[];
    creator: string;
    raised: number;
    needed: number;
}

interface CampaignPageProps {
    campaignId: string;
}

const CampaignPage = ({ campaignId }: CampaignPageProps) => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // Mock checks: Only Campaign 1 is owned by the current user
    const isOwner = isConnected && campaignId === "1";

    useEffect(() => {
        console.log('Looking for campaign ID:', campaignId);
        console.log('Available campaigns:', campaignsData);
        const foundCampaign = campaignsData.find((c) => c.id === campaignId);
        console.log('Found campaign:', foundCampaign);
        if (foundCampaign) {
            setCampaign(foundCampaign);
        }
    }, [campaignId]);

    if (!campaign) {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-16">
                        <div className="text-center">
                            <p className="text-lg font-sf-semibold text-zinc-900">Loading...</p>
                        </div>
                    </Container>
                </section>
            </main>
        );
    }

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative overflow-hidden bg-[#FAFAFA]">
                <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-96 max-h-screen">
                    <Gradient className={cn(
                        "-translate-y-3/4 blur-2xl"
                    )} />
                        <div className="relative flex flex-col items-center min-h-screen pt-16 w-full">
                        {/* Back Button - Only show after first slide */}
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
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            width={335}
                            height={180}
                            className="object-cover rounded-[20px]"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between gap-3">
                            <h2 className="text-2xl font-sf-semibold text-black">
                                {campaign.title}
                            </h2>
                            <Bookmark className="w-6 h-6 text-[#B6B6B6]" />
                        </div>
                        <div className="flex">
                            <ProgressBar  collected={campaign.raised} total={campaign.needed} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-sf-semibold text-black text-lg">
                                Deskripsi
                            </h3>
                            <p className="text-black text-sm font-sf-regular">
                                {campaign.description}
                            </p>
                        </div>
                        </div>
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
                                            className="w-full max-w-md bg-red-600 hover:bg-red-700" // Distinct color for owner action
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