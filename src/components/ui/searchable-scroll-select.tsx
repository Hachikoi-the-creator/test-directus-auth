"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export type SearchableSelectProps<T extends { label: string }> = {
  items: T[];
  className?: string;
  filterHandler: (query: string) => void;
  itemLabel: string;
  onSelect: (item: T) => void;
};

// * key for id is id-name, still will get duplicates so only grab the first one on selection
const placeholder = "Search...";
export function SearchableSelect<T extends { label: string }>({
  items,
  className,
  filterHandler,
  itemLabel,
  onSelect,
}: SearchableSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <>
      {itemLabel && (
        <div className="font-medium mb-1 flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          <div className="px-3 py-2 text-sm">Selected: {itemLabel}</div>
        </div>
      )}

      <div
        className={cn("border rounded-md", className)}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // ? added so the onClick handler can be triggered
          setTimeout(() => {
            setOpen(false);
          }, 100);
        }}
      >
        <div className="p-2">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              filterHandler(e.target.value);
            }}
            placeholder={placeholder || "Search..."}
          />
        </div>
        {open && (
          <ScrollArea className="h-64">
            <ul className="py-1">
              {items.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No results
                </li>
              )}
              {items.map((item, index) => {
                return (
                  <li key={index}>
                    <button
                      type="button"
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-muted",
                        itemLabel === item.label && "bg-muted"
                      )}
                      onClick={() => {
                        onSelect(item);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
