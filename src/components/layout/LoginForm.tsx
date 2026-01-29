"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
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
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

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

    // Web3 Wallet Login Handler
    const handleWeb3Login = async () => {
        setIsLoading(true);
        setError("");

        try {
            if (!isConnected) {
                // Connect wallet first
                connect({ connector: injected() });
                
                // Wait for connection
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (!address) {
                throw new Error('Wallet not connected');
            }

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
            
            // Redirect or update UI
            if (onSubmit) {
                onSubmit(formData);
            } else {
                window.location.href = '/home';
            }
        } catch (err: any) {
            console.error('❌ Wallet login error:', err);
            setError(err.message || 'Wallet login failed');
            
            // Disconnect on error
            if (isConnected) {
                disconnect();
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                

                {/* Error Message */}
                {error && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="flex gap-3 w-full">
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? 'Loading...' : 'Google'}
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        onClick={handleWeb3Login}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isConnected ? `Connected: ${address?.slice(0, 6)}...` : isLoading ? 'Connecting...' : 'Web3 Wallet'}
                    </Button>
                </div>
            </form>
        </>
    );
}
