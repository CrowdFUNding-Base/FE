"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import CampaignForm from "@/components/layout/CampaignForm";

const CreateCampaign = () => {
    const router = useRouter();

    const handleCreateCampaign = (data: any) => {
        console.log('Campaign Created:', data);
        // Add your campaign creation logic here
    };

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
                            <CampaignForm onSubmit={handleCreateCampaign} className="" />
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
