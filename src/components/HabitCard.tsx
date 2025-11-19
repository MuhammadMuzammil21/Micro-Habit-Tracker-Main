import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame, Users, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface HabitCardProps {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  streak: number;
  completed: boolean;
  teamMembers?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitCard = ({
  id,
  title,
  description,
  frequency,
  streak,
  completed: initialCompleted,
  teamMembers,
  onEdit,
  onDelete,
}: HabitCardProps) => {
  const { toast } = useToast();
  const [completed, setCompleted] = useState(initialCompleted);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      toast({
        title: "Habit Completed! 🎉",
        description: `Great job! You've completed "${title}".`,
      });
    }
    setCompleted(!completed);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast({
        title: "Habit Deleted",
        description: "The habit has been removed from your list.",
      });
    }
  };

  return (
    <Card className="p-6 hover:shadow-medium transition-smooth glass-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Button
            size="icon"
            variant={completed ? "default" : "outline"}
            onClick={handleToggle}
            className={`transition-smooth ${
              completed ? "gradient-primary shadow-soft hover:opacity-90" : "hover:bg-secondary/80"
            } ${isAnimating ? "animate-bounce" : ""}`}
          >
            <Check className={`h-5 w-5 ${completed ? "text-white" : ""}`} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit && onEdit(id)} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Habit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete Habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Badge variant="secondary" className="font-medium">
          {frequency}
        </Badge>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <Flame className="h-4 w-4" />
            <span>{streak} day streak</span>
          </div>
        )}

        {teamMembers && teamMembers > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
            <Users className="h-4 w-4" />
            <span>{teamMembers}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
