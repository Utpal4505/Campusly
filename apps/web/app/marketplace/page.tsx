"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CreateListingModal from "@/components/CreateListingModal";
import {
  MarketplaceItem,
  MarketplaceCategory,
  MARKETPLACE_CATEGORIES,
  getStoredMarketplaceItems,
  saveMarketplaceItems,
} from "@/lib/marketplace-data";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ShoppingBag,
  Plus,
  Search,
  SlidersHorizontal,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Tag,
  ArrowUpDown,
  X,
  Check,
  CheckCircle2,
  Bike,
  Cpu,
  BookOpen,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketplacePage() {
  const router = useRouter();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load items from local storage on mount
  useEffect(() => {
    setItems(getStoredMarketplaceItems());
  }, []);

  const handleCreateListing = (newItem: MarketplaceItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    saveMarketplaceItems(updated);
    setToastMessage("Your item was listed successfully on the Campus Marketplace!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & Sort Items
  const filteredItems = items
    .filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // maintain newest
    });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 p-3.5 rounded-xl border border-emerald-500/30 bg-card/95 text-foreground backdrop-blur-md shadow-xl flex items-center gap-2.5 animate-in fade-in-0 slide-in-from-top-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative p-6 sm:p-8 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-muted/30 to-card shadow-xs overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Campus P2P Gear Exchange</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Verified Students Only
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                LPU Student Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Buy, sell, and rent engineering mini-drafters, lab coats, scientific calculators, textbooks, bicycles, and hostel room gear directly from peers on campus with zero platform fees.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-2xl h-11 px-5 text-xs font-bold gap-2 shadow-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Sell an Item</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              let Icon = Sparkles;
              if (cat.id === "lab") Icon = Wrench;
              if (cat.id === "electronics") Icon = Cpu;
              if (cat.id === "books") Icon = BookOpen;
              if (cat.id === "hostel") Icon = Bike;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drafter, calculator, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-8 py-1.5 text-xs rounded-xl border border-border/80 bg-background placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-border/80 bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
          {filteredItems.map((item) => {
            const discountPercent =
              item.originalPrice && item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : null;

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col overflow-hidden shadow-2xs hover:shadow-md"
              >
                {/* Photo Banner */}
                <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden border-b border-border/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Condition Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {item.condition}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {discountPercent && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Price Row */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-foreground">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pickup Spot & Seller Block */}
                  <div className="pt-2.5 border-t border-border/60 space-y-2.5">
                    {/* Pickup Spot */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>

                    {/* Seller Profile & Chat CTA */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border/80 shrink-0">
                          <img
                            src={getAnimeAvatar(item.seller.name, item.seller.username)}
                            alt={item.seller.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-foreground truncate leading-none">
                            {item.seller.name}
                          </p>
                          <span className="text-[9px] text-muted-foreground truncate block mt-0.5">
                            @{item.seller.username}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/messages/${item.seller.username}`}
                        className="shrink-0"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2.5 rounded-lg text-[11px] font-semibold gap-1 text-primary hover:bg-primary/10 hover:border-primary/40 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No campus listings found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Try clearing your search or category filter, or be the first student to post this item!
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List an Item Now</span>
            </Button>
          </div>
        )}
      </main>

      {/* Sell Item Modal */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateListing}
      />
    </div>
  );
}
