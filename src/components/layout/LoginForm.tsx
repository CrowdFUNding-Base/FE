"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import InputField from "@/components/element/InputField";
import { Button } from "@/components/element/Button";
import { cn } from "@/utils/helpers/cn";
import { loginWithWallet } from "@/utils/api/auth";
import { checkWalletSync, syncWallet } from "@/utils/api/sync";
import SyncConfirmModal from "@/components/element/SyncConfirmModal";
import axios from "axios";

interface LoginFormProps {
    variant?: "login" | "register";
    onSubmit?: (data: FormData) => void;
    className?: string;
}

interface FormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export default function LoginForm({ variant = "login", onSubmit, className }: LoginFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [syncData, setSyncData] = useState<any>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

    // Wagmi hooks
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();

    const [isLoginPending, setIsLoginPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    // Google Login Handler - Redirect to backend OAuth flow
    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';
        window.location.href = `${backendUrl}/auth/google`;
    };

    // Trigger Web3 Login
    const handleWeb3Login = () => {
        setError("");
        setIsLoginPending(true); // Signal that we want to login once connected

        if (!isConnected && openConnectModal) {
             openConnectModal();
        } 
        // If already connected, the useEffect will catch it immediately
    };

    // Effect to handle login once wallet is connected
    useEffect(() => {
        let isMounted = true;

        const performWalletLogin = async () => {
            if (isLoginPending && isConnected && address) {
                setIsLoading(true);
                try {
                     // Check if user is already logged in with Google
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';
                    try {
                        const authCheck = await axios.get(`${backendUrl}/auth/me`, {
                            withCredentials: true,
                        });

                        if (authCheck.data.authenticated && authCheck.data.user.is_google_auth) {
                            // User is logged in with Google, check if wallet can be synced
                            const syncCheck = await checkWalletSync(address);
                            
                            if (syncCheck.needsSync) {
                                // Show sync confirmation modal
                                setSyncData({
                                    walletAddress: address,
                                    currentUser: {
                                        email: authCheck.data.user.email,
                                    },
                                });
                                setCurrentUserEmail(authCheck.data.user.email);
                                setShowSyncModal(true);
                                setIsLoading(false);
                                setIsLoginPending(false); // Stop pending
                                return;
                            } else if (syncCheck.conflict) {
                                throw new Error('This wallet is already connected to another account');
                            }
                        }
                    } catch (authError: any) {
                        // User not logged in, proceed with normal wallet login
                        console.log('No existing session, proceeding with wallet login');
                    }

                    // Send wallet address to backend (create new user or login)
                    const response = await loginWithWallet({
                        walletAddress: address,
                        role: 'contributor',
                    });

                    console.log('✅ Wallet login successful:', response);
                    
                    if (isMounted) {
                        setIsSuccess(true);
                        // Delay redirect for UX
                        setTimeout(() => {
                            if (onSubmit) {
                                onSubmit(formData);
                            } else {
                                window.location.href = '/home';
                            }
                        }, 2000);
                    }
                } catch (err: any) {
                    console.error('❌ Wallet login error:', err);
                    if (isMounted) setError(err.message || 'Wallet login failed');
                    
                    // Disconnect on error if it was a login attempt
                    // if (isConnected) disconnect(); // Optional: maybe don't disconnect, just show error
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                        setIsLoginPending(false);
                    }
                }
            }
        };

        performWalletLogin();

        return () => { isMounted = false; };
    }, [isLoginPending, isConnected, address, formData, onSubmit]);


    // Handle sync confirmation
    const handleSyncConfirm = async () => {
        setIsLoading(true);
        setError("");

        try {
            if (!address) {
                throw new Error('Wallet not connected');
            }

            await syncWallet(address, 'contributor');
            
            console.log('✅ Wallet synced successfully');
            setShowSyncModal(false);
            
            // Redirect to home
            window.location.href = '/home';
        } catch (err: any) {
            console.error('❌ Wallet sync error:', err);
            setError(err.message || 'Failed to sync wallet');
            setShowSyncModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Sync Confirmation Modal */}
            <SyncConfirmModal
                isOpen={showSyncModal}
                onClose={() => setShowSyncModal(false)}
                onConfirm={handleSyncConfirm}
                type="wallet"
                data={syncData || {}}
                isLoading={isLoading}
            />

            <form
                onSubmit={handleSubmit}
                className={cn(
                    "flex flex-col justify-center items-center gap-3 w-full p-6 rounded-[20px] bg-white shadow-[0_8px_20px_0_rgba(0,0,0,0.15)]",
                    className
                )}
            >
                {/* Success Message */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-4 w-full">
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-xl font-bold text-gray-900">Login Successful!</h3>
                                <p className="text-gray-500">Redirecting to Home...</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Error Message */}
                        {error && (
                            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Social Login Buttons */}
                        <div className="flex gap-3 w-full flex-col min-w-sm">
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Google'}
                            </Button>
                            <Button
                                variant="secondary"
                                size="md"
                                type="button"
                                onClick={handleWeb3Login}
                                disabled={isLoading}
                            >
                                {isConnected ? `Connected: ${address?.slice(0, 6)}...` : isLoading ? 'Connecting...' : 'Web3 Wallet'}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </>
    );
}
