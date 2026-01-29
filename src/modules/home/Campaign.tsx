'use client';

import { useState, useRef, useMemo } from "react";
import { cn } from "@/utils/helpers/cn";
import Container from "@/components/layout/container";
import { Button } from "@/components";
import { CampaignCard } from "@/components";
import InputField from "@/components/element/InputField";
import { Search, ArrowDown, MessageCircleWarning, Siren, BookOpen, HeartPulse, X } from "lucide-react";
import campaignsData from "@/data/campaigns.json";

const Campaign = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter campaigns based on search query
    const filteredCampaigns = useMemo(() => {
        if (!searchQuery.trim()) return campaignsData;
        
        const query = searchQuery.toLowerCase();
        return campaignsData.filter((campaign: any) => {
            return (
                campaign.id.toLowerCase().includes(query) ||
                campaign.title.toLowerCase().includes(query) ||
                campaign.description.toLowerCase().includes(query) ||
                campaign.creator.toLowerCase().includes(query) ||
                campaign.tags.some((tag: string) => tag.toLowerCase().includes(query))
            );
        });
    }, [searchQuery]);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                          Cari
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<ArrowDown className="w-3.5 h-3.5" />}>
                          Urutkan
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<MessageCircleWarning className="w-3.5 h-3.5" />}>
                          Prioritas
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<Siren className="w-3.5 h-3.5" />}>
                          Bencana
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<BookOpen className="w-3.5 h-3.5" />}>
                          Pendidikan
                        </Button>
                        <Button variant="rounded" size="rounded" leftIcon={<HeartPulse className="w-3.5 h-3.5" />}>
                          Kesehatan
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
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign: any) => (
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
                                <p className="text-lg font-sf-semibold text-gray-600 mb-1">Tidak ada hasil</p>
                                <p className="text-sm font-sf-regular text-gray-400">
                                    Coba kata kunci lain untuk pencarian Anda
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