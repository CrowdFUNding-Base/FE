"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import Gradient from "@/components/element/Gradient";
import LoginForm from "@/components/layout/LoginForm";

const Login = () => {
    const router = useRouter();

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
                                    <h1 className="text-lg font-sf-semibold text-black">CrowdFUNding</h1>
                                </div>
                            </div>

                       
                    
                        {/* Content Area */}
                        <div className={cn(
                            "flex-1 flex flex-col items-center gap-8 py-8 w-auto max-w-lg justify-center"
                        )}>
                            <LoginForm variant="login" onSubmit={(data) => console.log('Login:', data)} />
                        </div>
                        
                        {/* Bottom Section */}
                        <div className="w-full max-w-md space-y-6 pb-8 ">
                            {/* Continue Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                onClick= {() => router.push("/home")}
                                className="w-full"
                            >
                                Masuk Sebagai Guest
                            </Button>
                            
                          
                        </div>
            </div>
            </Container>
            </section>
        </main>
    );
};

export default Login;