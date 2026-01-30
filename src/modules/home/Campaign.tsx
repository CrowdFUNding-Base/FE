'use client';

import { useState, useRef, useMemo } from "react";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import { Button } from "@/components";
import { CampaignCard } from "@/components";
import InputField from "@/components/element/InputField";
import { Search, ArrowDown, MessageCircleWarning, Siren, BookOpen, HeartPulse, X, Loader2 } from "lucide-react";
import { useCampaignsForUI } from "@/hooks/useCrowdfunding";

const Campaign = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch campaigns from backend API
    const { campaigns, isLoading, error } = useCampaignsForUI({ refetchInterval: 5000 });

    // Filter campaigns based on search query
    const filteredCampaigns = useMemo(() => {
        if (!searchQuery.trim()) return campaigns;
        
        const query = searchQuery.toLowerCase();
        return campaigns.filter((campaign) => {
            return (
                campaign.id.toLowerCase().includes(query) ||
                campaign.title.toLowerCase().includes(query) ||
                campaign.description.toLowerCase().includes(query) ||
                campaign.creatorName.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, campaigns]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setHasMoved(false);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        
        if (Math.abs(walk) > 5) {
            setHasMoved(true);
        }
        
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery("");
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <main className={cn("relative overflow-x-clip")}>
            <section className="relative bg-[#FAFAFA]">
                <Container className="relative flex flex-col items-center justify-center gap-6 py-0">
                    <div 
                        ref={scrollContainerRef}
                        className={cn(
                            "flex flex-row gap-3 overflow-x-auto scrollbar-hide select-none whitespace-nowrap w-full",
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        )}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                    >
                        <Button 
                            variant="rounded" 
                            size="rounded" 
                            leftIcon={<Search className="w-3.5 h-3.5" />}
                            onClick={handleSearchClick}
                        >
                          Search
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<ArrowDown className="w-3.5 h-3.5" />}>
                          Sort
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<MessageCircleWarning className="w-3.5 h-3.5" />}>
                          Priority
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<Siren className="w-3.5 h-3.5" />}>
                          Disaster
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
                          Education
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<HeartPulse className="w-3.5 h-3.5" />}>
                          Health
                        </Button>
                    </div>
                    
                    {/* Search Input */}
                    {isSearchOpen && (
                        <div className="w-full">
                            <InputField
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Cari berdasarkan judul, deskripsi, tag, atau creator..."
                                variant="search"
                                type="search"
                                leftIcon={<Search className="w-5 h-5" />}
                                rightIcon={
                                    searchQuery ? (
                                        <button
                                            onClick={handleClearSearch}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    ) : undefined
                                }
                                helperText={searchQuery ? `${filteredCampaigns.length} hasil ditemukan` : ''}
                                className="w-full"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-4 w-full py-0 pb-24">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Loader2 className="w-12 h-12 text-cyan-500 mb-3 animate-spin" />
                                <p className="text-lg font-sf-semibold text-gray-600 mb-1">Memuat Campaign...</p>
                                <p className="text-sm font-sf-regular text-gray-400">
                                    Fetching data from the blockchain, please wait a moment.
                                </p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                    <X className="w-6 h-6 text-red-500" />
                                </div>
                                <p className="text-lg font-sf-semibold text-gray-600 mb-1">Gagal Memuat Data</p>
                                <p className="text-sm font-sf-regular text-gray-400">
                                    {error.message || 'Terjadi kesalahan saat mengambil data'}
                                </p>
                            </div>
                        ) : filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    id={campaign.id}
                                    imageUrl={campaign.imageUrl}
                                    title={campaign.title}
                                    description={campaign.description}
                                    progress={campaign.progress}
                                    needed={campaign.needed}
                                    raised={campaign.raised}
                                    className="min-w-[320px]"
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-lg font-sf-semibold text-gray-600 mb-1">
                                    {searchQuery ? 'Tidak ada hasil' : 'Belum ada campaign'}
                                </p>
                                <p className="text-sm font-sf-regular text-gray-400">
                                    {searchQuery 
                                        ? 'Coba kata kunci lain untuk pencarian Anda'
                                        : 'Jadilah yang pertama membuat campaign!'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </Container>
            </section>
        </main>
    );
};

export default Campaign;