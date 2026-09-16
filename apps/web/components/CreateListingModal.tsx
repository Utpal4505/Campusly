"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { MarketplaceItem, ItemCondition } from "@/lib/marketplace-data";
import {
  X,
  Plus,
  ShoppingBag,
  Sparkles,
  MapPin,
  IndianRupee,
  Camera,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (item: MarketplaceItem) => void;
}

const PHOTO_PRESETS = [
  {
    label: "Mini Drafter",
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Scientific Calculator",
    url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Lab Coat & Goggles",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Arduino / IoT Kit",
    url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Textbook / Notes",
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Campus Bicycle",
    url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Electric Kettle",
    url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80",
  },
];

const PICKUP_HUBS = [
  "BH-4 (Boys Hostel 4, Block A)",
  "BH-2 (Boys Hostel 2)",
  "BH-6 (Boys Hostel 6)",
  "GH-2 (Girls Hostel 2)",
  "GH-1 (Girls Hostel 1)",
  "UniMall Food Court",
  "Block 38 • Innovation Studio",
  "Block 34 • Central Computer Lab",
  "Central Library Lawn",
  "Baldev Raj Mittal Unipolis",
];

export default function CreateListingModal({
  isOpen,
  onClose,
  onCreated,
}: CreateListingModalProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"lab" | "books" | "electronics" | "hostel">("lab");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [condition, setCondition] = useState<ItemCondition>("Like New");
  const [pickupLocation, setPickupLocation] = useState(PICKUP_HUBS[0]!);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(PHOTO_PRESETS[0]!.url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || isNaN(Number(price))) return;

    const newItem: MarketplaceItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice && !isNaN(Number(originalPrice)) ? Number(originalPrice) : undefined,
      condition,
      pickupLocation: pickupLocation || PICKUP_HUBS[0]!,
      description: description.trim() || "Clean verified student gear, available for immediate pickup on campus.",
      image: imageUrl || PHOTO_PRESETS[0]!.url,
      seller: {
        name: user?.name || "Student Seller",
        username: user?.username || "campus_seller",
        branch: "LPU Student",
        year: "Current Student",
        verifiedStudent: true,
      },
      createdAt: "Just now",
    };

    onCreated(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-md animate-in fade-in-0">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/70 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-none">
                Post Item for Sale / Exchange
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Verified peer-to-peer campus exchange for LPU students
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Item Title */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              Item Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Omega Engineering Mini Drafter with Bag"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category & Condition Row */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="lab">Lab & Workshop Gear</option>
                <option value="electronics">Electronics, IoT & Calc</option>
                <option value="books">Textbooks & Exam Notes</option>
                <option value="hostel">Hostel Living & Cycles</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Condition</label>
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                {(["Like New", "Gently Used", "Fair"] as ItemCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                      condition === cond
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">
                Selling Price (₹ INR) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={10}
                  max={50000}
                  placeholder="e.g. 450"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-border/80 bg-background text-foreground font-semibold placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">
                Original MRP / Purchase Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  ₹
                </span>
                <input
                  type="number"
                  min={10}
                  placeholder="e.g. 950"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Campus Pickup Location */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              Campus Handover / Pickup Spot
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {PICKUP_HUBS.map((hub) => (
                <option key={hub} value={hub}>
                  {hub}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              Condition & Item Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Clean scale arms, zero scratches, used only 1 semester for MEC107..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Photo Preset Selector */}
          <div className="space-y-2">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span>Item Photo Preset (Or paste custom URL)</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                Select quick sample
              </span>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {PHOTO_PRESETS.map((preset) => {
                const isSelected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden border p-0.5 transition-all cursor-pointer aspect-square ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/40 shadow-xs"
                        : "border-border/70 hover:border-primary/50 opacity-80"
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <input
              type="url"
              placeholder="Custom image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-border/70 bg-background text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-5 text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List on Campus Marketplace</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
