"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import CampaignForm, { CampaignFormData } from "@/components/layout/CampaignForm";
import { useCreateCampaign } from "@/hooks/useCreateCampaign";
import { CheckCircle, XCircle, Wallet } from "lucide-react";

const CreateCampaign = () => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const { 
        createCampaign, 
        status, 
        txHash, 
        error, 
        reset 
    } = useCreateCampaign();

    // Redirect to home on success after a delay
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                router.push('/home');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    const handleCreateCampaign = async (data: CampaignFormData) => {
        await createCampaign({
            name: data.title,
            creatorName: data.creator,
            description: data.description,
            targetAmount: Number(data.targetAmount),
        });
    };

    // Loading text based on status
    const getLoadingText = () => {
        switch (status) {
            case 'pending':
                return 'Confirm in wallet...';
            case 'confirming':
                return 'Confirming transaction...';
            default:
                return 'Creating...';
        }
    };

    // Show success state
    if (status === 'success') {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA]">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-screen">
                        <Gradient className={cn("-translate-y-1/2 rounded-b-[60px]")} />
                        <div className="relative flex flex-col items-center justify-center gap-6 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-sf-bold text-black">Campaign Created!</h1>
                            <p className="text-gray-600 font-sf-regular">
                                Your campaign has been created on the blockchain.
                            </p>
                            {txHash && (
                                <a 
                                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 underline text-sm font-sf-medium"
                                >
                                    View on BaseScan →
                                </a>
                            )}
                            <p className="text-sm text-gray-400 font-sf-regular">
                                Redirecting to home...
                            </p>
                        </div>
                    </Container>
                </section>
            </main>
        );
    }

    // Show error state
    if (status === 'error') {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA]">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-screen">
                        <Gradient className={cn("-translate-y-1/2 rounded-b-[60px]")} />
                        <div className="relative flex flex-col items-center justify-center gap-6 text-center max-w-md">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <h1 className="text-2xl font-sf-bold text-black">Transaction Failed</h1>
                            <p className="text-gray-600 font-sf-regular">
                                {error?.message || 'Something went wrong. Please try again.'}
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={reset}
                            >
                                Try Again
                            </Button>
                        </div>
                    </Container>
                </section>
            </main>
        );
    }

    // Show wallet not connected state
    if (!isConnected) {
        return (
            <main className={cn("relative overflow-x-clip")}>
                <section className="relative overflow-hidden bg-[#FAFAFA]">
                    <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-screen">
                        <Gradient className={cn("-translate-y-1/2 rounded-b-[60px]")} />
                        <div className="relative flex flex-col items-center justify-center gap-6 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-12 h-12 text-gray-400" />
                            </div>
                            <h1 className="text-2xl font-sf-bold text-black">Connect Your Wallet</h1>
                            <p className="text-gray-600 font-sf-regular">
                                Please connect your wallet to create a campaign.
                            </p>
                            <Button
                                variant="black"
                                size="md"
                                onClick={() => router.back()}
                            >
                                Go Back
                            </Button>
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
                        "-translate-y-1/2 rounded-b-[60px]"
                    )} />
                        <div className="relative flex flex-col items-center justify-between min-h-screen pt-16 w-full">
                        {/* Back Button - Only show after first slide */}
                            <div className="flex flex-row items-center">
                                <Button 
                                    variant={"black"}
                                    size={"sm"}
                                    onClick={() => router.back()}
                                    className="absolute left-0"
                                    disabled={status === 'pending' || status === 'confirming'}
                                >
                                    ←
                                </Button>
                                 {/* Header */}
                                <div className="text-center">
                                    <h1 className="text-lg font-sf-semibold text-black">Create Campaign</h1>
                                </div>
                            </div>

                       
                    
                        {/* Content Area */}
                        <div className={cn(
                            "flex-1 flex flex-col items-center gap-8 py-2 w-full justify-center"
                        )}>
                            <CampaignForm 
                                onSubmit={handleCreateCampaign} 
                                className=""
                                isLoading={status === 'pending' || status === 'confirming'}
                                loadingText={getLoadingText()}
                            />
                        </div>
                        
                        {/* Bottom Section - Empty for spacing */}
                        <div className="w-full max-w-md pb-8" />
            </div>
            </Container>
            </section>
        </main>
    );
};

export default CreateCampaign;
