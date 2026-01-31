"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import { CampaignCard } from "@/components/element/CampaignCard";
import { getAllVaults, VaultData } from "@/utils/api/vaults";

export default function CampaignsListPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<VaultData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [filter, setFilter] = useState<'active' | 'completed' | 'cancelled' | 'expired'>('active');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching campaigns with status:', filter);
                
                const response = await getAllVaults({
                    status: filter,
                    limit: 50,
                    offset: 0,
                });
                
                console.log('Campaigns received:', response.data);
                setCampaigns(response.data);
                setError("");
            } catch (err: any) {
                console.error('Error fetching campaigns:', err);
                setError(err.message || 'Failed to load campaigns');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, [filter]);

    const handleCampaignClick = (vaultId: string) => {
        router.push(`/campaign/${vaultId}`);
    };

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
                <Container className="relative flex flex-col gap-6 py-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-sf-bold text-black">
                            Campaigns
                        </h1>
                        
                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {(['active', 'completed', 'cancelled', 'expired'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-sf-medium transition-colors whitespace-nowrap",
                                        filter === status
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600 font-sf-medium">Loading campaigns...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 font-sf-medium">{error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && campaigns.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-gray-600 font-sf-medium text-lg">
                                No {filter} campaigns found
                            </p>
                        </div>
                    )}

                    {/* Campaigns Grid */}
                    {!isLoading && !error && campaigns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => {
                                const progressPercentage = campaign.vault.targetAmount > 0
                                    ? (campaign.vault.currentAmount / campaign.vault.targetAmount) * 100
                                    : 0;

                                return (
                                    <div
                                        key={campaign.vault.vaultId}
                                        onClick={() => handleCampaignClick(campaign.vault.vaultId)}
                                        className="cursor-pointer transition-transform hover:scale-105"
                                    >
                                        <CampaignCard
                                            id={campaign.vault.vaultId}
                                            imageUrl="/assets/images/campaign-placeholder.jpg"
                                            title={campaign.vault.title}
                                            description={campaign.vault.description.substring(0, 100) + '...'}
                                            progress={progressPercentage}
                                            raised={campaign.vault.currentAmount}
                                            needed={campaign.vault.targetAmount}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Campaign Count */}
                    {!isLoading && campaigns.length > 0 && (
                        <div className="text-center text-gray-600 font-sf-regular">
                            Showing {campaigns.length} {filter} campaign{campaigns.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}
