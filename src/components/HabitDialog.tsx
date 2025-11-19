import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: {
    id: string;
    title: string;
    description: string;
    frequency: "daily" | "weekly";
  };
  onSubmit?: (data: any) => void;
}

export const HabitDialog = ({ open, onOpenChange, habit, onSubmit }: HabitDialogProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(habit?.title || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly">(habit?.frequency || "daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit title",
        variant: "destructive",
      });
      return;
    }

    const habitData = {
      id: habit?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      frequency,
      streak: habit ? undefined : 0,
      completed: habit ? undefined : false,
      teamMembers: habit ? undefined : 0,
    };

    if (onSubmit) {
      onSubmit(habitData);
    }

    toast({
      title: habit ? "Habit Updated" : "Habit Created",
      description: habit ? "Your habit has been updated successfully." : "Your new habit has been created successfully.",
    });

    onOpenChange(false);
    
    // Reset form if creating new habit
    if (!habit) {
      setTitle("");
      setDescription("");
      setFrequency("daily");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {habit ? "Update your habit details below." : "Define your new habit. Set a clear goal and frequency to stay consistent."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Exercise"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., 30 minutes of cardio or strength training"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select value={frequency} onValueChange={(value: "daily" | "weekly") => setFrequency(value)}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary">
              {habit ? "Update Habit" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};