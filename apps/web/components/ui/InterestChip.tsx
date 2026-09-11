"use client"

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"

interface InterestChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function InterestChip({ label, selected = false, onClick }: InterestChipProps) {
  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className={cn(
        "cursor-pointer transition-colors",
        selected && "bg-primary text-primary-foreground border-primary"
      )}
      onClick={onClick}
    >
      {label}
    </Badge>
  );
}
