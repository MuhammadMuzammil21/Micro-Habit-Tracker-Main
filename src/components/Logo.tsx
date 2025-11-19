import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  linkTo?: string;
}

export const Logo = ({ 
  className, 
  showText = true, 
  size = "md",
  linkTo = "/"
}: LogoProps) => {
  const sizeClasses = {
    sm: {
      icon: "h-6 w-6",
      text: "text-base",
      iconText: "text-sm"
    },
    md: {
      icon: "h-8 w-8",
      text: "text-xl",
      iconText: "text-lg"
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-2xl",
      iconText: "text-xl"
    }
  };

  const currentSize = sizeClasses[size];

  const logoContent = (
    <div className={cn("flex items-center gap-2 group", className)}>
      <div className={cn(
        "rounded-lg gradient-primary flex items-center justify-center group-hover:scale-105 transition-smooth",
        currentSize.icon
      )}>
        <span className={cn("text-white font-bold", currentSize.iconText)}>H</span>
      </div>
      {showText && (
        <span className={cn("font-bold", currentSize.text)}>HabitLink</span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

