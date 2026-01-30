"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "@/components/layout/container";
import { cn } from "@/utils/helpers/cn";
import { Button } from "@/components/element/Button";
import WalletButton from '@/components/element/WalletButton';
import CharityCard from '@/components/element/CharityCard';
import { Plus } from "lucide-react";
import { getCharityPoints, getStreak } from "@/utils/localStorage";


const Hero = () => {
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setPoints(getCharityPoints());
        setStreak(getStreak());
    }, []);

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative overflow-hidden bg-[#FAFAFA]">
                <Container className="relative flex flex-col items-center justify-center gap-6 py-6 min-h-96">
                    <div className="absolute bg-[#EDEDED] w-full top-0 h-90 overflow-clip rounded-b-[60px]">
                        <div className="absolute w-108 h-107 -top-6 -left-40 bg-cyan-100 rounded-full blur-3xl" />
                        <div className="absolute w-108 h-107 -top-52 -right-80 bg-yellow-100 rounded-full blur-3xl" />
                        <div className="absolute w-108 h-132 top-4 -right-32 bg-blue-100 rounded-full blur-3xl" />
                    </div>
                    <div className="relative flex flex-row items-center justify-between gap-4.5 w-full h-fit mt-10">
                        <div className="font-sf-semibold text-lg text-black">
                            CrowdFUNding
                        </div>
                        <Button 
                            variant="black" 
                            size="sm" 
                            leftIcon={<Plus className="w-3.5 h-3.5" />} 
                            className="px-3.5"
                            onClick={() => router.push("/campaign/create")}
                        >
                            Create
                        </Button>
                    </div>
                    <CharityCard 
                        collected={points} 
                        streak={streak} 
                        totalDays={100}
                        onArrowClick={() => router.push('/profile/achievements')}
                        className="z-10"
                    />
                    <WalletButton className="z-10" />
                </Container>
            </section>
        </main>
    );
};

export default Hero;