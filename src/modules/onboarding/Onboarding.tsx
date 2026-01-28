"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import Image from "next/image";
import { div } from "framer-motion/client";

interface SlideContent {
    title: string;
    subtitle: string;
    image?: string | null;
}

const Onboarding = () => {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides: SlideContent[] = [
        {
            title: "CrowdFUNding",
            subtitle: "Aplikasi untuk berbuat baik dengan mudah, aman, dan menyenangkan",
            image: null,
        },
        {
            title: "Donasi",
            subtitle: "Untuk membersihkan harta dan berbagi manfaat bagi sesama.",
            image: "/assets/images/onboarding-2.png",
        },
        {
            title: "Aman",
            subtitle: "Teknologi Blockchain membuat anda lebih aman dengan fitur Wallet",
            image: "/assets/images/onboarding-3.png",
        },
        {
            title: "Menyenangkan",
            subtitle: "Aplikasi donasi menggunakan fitur-fitur gamifikasi yang menarik",
            image: "/assets/images/onboarding-4.png",
        },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            router.push("/login");
        }
    };

    const currentSlideData = slides[currentSlide];

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative overflow-hidden bg-[#FAFAFA]">
                <Container className="relative flex flex-col items-center justify-center gap-6 py-0 min-h-96 max-h-screen w-full">
                    <Gradient className={cn(
                        "transition-transform duration-700 ease-in-out",
                        currentSlide > 0 && "-translate-y-43 rounded-b-[60px]"
                    )} />
                        <div className="relative flex flex-col items-center justify-between min-h-screen pt-16 w-full">
                        {/* Back Button - Only show after first slide */}
                        {currentSlide > 0 && (
                            <div className="flex flex-row items-center">
                                <Button 
                                    variant={"black"}
                                    size={"sm"}
                                    onClick={() => setCurrentSlide(currentSlide - 1)}
                                    className="absolute left-0"
                                >
                                    ←
                                </Button>
                                 {/* Header */}
                                <div className="text-center">
                                    <h1 className="text-lg font-sf-semibold text-black">CrowdFUNding</h1>
                                </div>
                            </div>
                        )}

                       
                    
                        {/* Content Area */}
                        <div className={cn(
                            "flex-1 flex flex-col items-center gap-8 py-8 w-auto max-w-lg",
                            currentSlideData.image ? "justify-between" : "justify-center"
                        )}>
                            {/* Slide Content Card */}
                            {currentSlideData.image && (
                                <div className="w-full flex-1 items-center flex justify-center ">
                                    <Image
                                      src={currentSlideData.image}
                                      alt={currentSlideData.title}
                                      width={335}
                                      height={500}
                                      className="object-cover h-full"
                                    />
                                </div>
                            )}

                            {/* Title and Subtitle */}
                            <div className="flex flex-col text-center gap-4 w-full">
                                <div className="text-[32px] text-black font-sf-semibold">{currentSlideData.title}</div>
                                <div className="text-[#777777] text-lg font-sf-regular leading-relaxed">
                                    {currentSlideData.subtitle}
                                </div>
                            </div>
                        </div>
                        
                        {/* Bottom Section */}
                        <div className="w-full max-w-md space-y-6 pb-8 ">
                            {/* Slide Indicators */}
                            <div className="flex justify-center gap-1 bg-[#F4F4F4] rounded-full mx-auto w-fit p-0.5">
                                {slides.map((_, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-300",
                                            index === currentSlide
                                                ? "w-8 bg-[#757F90]"
                                                : "w-2.5 bg-[#B2B2B2]"
                                        )}
                                    />
                                ))}
                            </div>
                            
                            {/* Continue Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNext}
                                className="w-full"
                            >
                                Lanjut
                            </Button>
                            
                            {/* Sign In Link */}
                            <p className="text-center text-xs font-sf-medium text-gray-600">
                                Sudah punya akun?{" "}
                                <button
                                    onClick={() => router.push("/login")}
                                    className="text-gray-900 font-sf-medium hover:underline"
                                >
                                    Masuk disini
                                </button>
                            </p>
                        </div>
            </div>
            </Container>
            </section>
        </main>
    );
};

export default Onboarding;