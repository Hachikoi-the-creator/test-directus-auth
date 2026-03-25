import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Simple select component without search functionality
type CustomSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
};

export default function CustomSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current && dropdownRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 224; // max-h-56 = 14rem = 224px

      const spaceBelow = viewportHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: { value: string; label: string }) => {
    onValueChange(option.value);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close if focus is moving to the dropdown
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    // Close dropdown after a short delay to allow for option selection
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={handleToggle}
        onBlur={handleBlur}
        tabIndex={0}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !selectedOption && "text-muted-foreground",
          "cursor-pointer"
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex-1 text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 w-full border rounded-md shadow-lg bg-background overflow-hidden",
            dropdownPosition === "bottom" ? "top-full mt-1" : "bottom-full mb-1"
          )}
          style={{ maxHeight: "224px" }}
          role="listbox"
          aria-label="Options"
        >
          <div className="max-h-56 overflow-y-auto">
            <div className="p-1">
              {options.length > 0 ? (
                options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <span className="flex-1">{option.label}</span>
                    {value === option.value && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
