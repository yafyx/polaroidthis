import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  color?: string;
}

export const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  isActive,
  color = "bg-white",
}: FloatingActionButtonProps) => (
  <Button
    onClick={onClick}
    variant="outline"
    size="sm"
    className={cn(
      "h-9 shadow-sm rounded-md flex items-center gap-1.5 px-3 transition-all",
      color,
      isActive ? "ring-2 ring-primary" : "hover:bg-slate-50"
    )}
  >
    <Icon className="h-4 w-4" />
    <span className="text-xs font-medium">{label}</span>
  </Button>
);
