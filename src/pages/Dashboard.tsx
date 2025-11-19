import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HabitCard } from "@/components/HabitCard";
import { TeamFeed } from "@/components/TeamFeed";
import { StatsOverview } from "@/components/StatsOverview";
import { HabitDialog } from "@/components/HabitDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data
const mockHabits = [
  {
    id: "1",
    title: "Morning Exercise",
    description: "30 minutes of cardio or strength training",
    frequency: "daily" as const,
    streak: 12,
    completed: true,
    teamMembers: 3,
  },
  {
    id: "2",
    title: "Read for 20 minutes",
    description: "Read books, articles, or educational content",
    frequency: "daily" as const,
    streak: 8,
    completed: false,
    teamMembers: 5,
  },
  {
    id: "3",
    title: "Meditation",
    description: "10 minutes of mindfulness practice",
    frequency: "daily" as const,
    streak: 15,
    completed: true,
    teamMembers: 4,
  },
  {
    id: "4",
    title: "Drink 8 glasses of water",
    description: "Stay hydrated throughout the day",
    frequency: "daily" as const,
    streak: 5,
    completed: false,
    teamMembers: 8,
  },
  {
    id: "5",
    title: "Code Review",
    description: "Review team pull requests",
    frequency: "weekly" as const,
    streak: 3,
    completed: true,
    teamMembers: 5,
  },
  {
    id: "6",
    title: "Journaling",
    description: "Write down thoughts and reflections",
    frequency: "daily" as const,
    streak: 7,
    completed: false,
    teamMembers: 2,
  },
  {
    id: "7",
    title: "Learn New Tech",
    description: "Study new programming concepts or tools",
    frequency: "daily" as const,
    streak: 18,
    completed: true,
    teamMembers: 6,
  },
  {
    id: "8",
    title: "Team Standup",
    description: "Daily sync with the team",
    frequency: "daily" as const,
    streak: 23,
    completed: true,
    teamMembers: 8,
  },
];

const mockFeedItems = [
  {
    id: "1",
    userName: "Sarah Kim",
    habitTitle: "Morning Exercise",
    timestamp: "2 minutes ago",
    streakMilestone: 30,
  },
  {
    id: "2",
    userName: "Robert Park",
    habitTitle: "Meditation",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    userName: "Alice Miller",
    habitTitle: "Read for 20 minutes",
    timestamp: "1 hour ago",
    streakMilestone: 50,
  },
  {
    id: "4",
    userName: "Tom Wilson",
    habitTitle: "Code Review",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    userName: "Lisa Martinez",
    habitTitle: "Drink 8 glasses of water",
    timestamp: "3 hours ago",
  },
  {
    id: "6",
    userName: "Nina Patel",
    habitTitle: "Team Standup",
    timestamp: "4 hours ago",
    streakMilestone: 25,
  },
  {
    id: "7",
    userName: "Ben Harris",
    habitTitle: "Journaling",
    timestamp: "5 hours ago",
  },
];

const Dashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  const handleCreateHabit = (habitData: any) => {
    setHabits([...habits, habitData]);
  };

  const handleEditHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setEditingHabit(habit);
      setDialogOpen(true);
    }
  };

  const handleUpdateHabit = (updatedHabit: any) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? { ...h, ...updatedHabit } : h));
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingHabit(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background dark:from-background dark:via-secondary/10 dark:to-background">
      <Navbar />

      <main className="container px-4 py-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent tracking-tight">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            You've completed 5 habits today. Keep up the great work! 🎉
          </p>
        </div>

        <StatsOverview />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Your Habits</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:bg-secondary/80"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
            </div>

            <div className="grid gap-4">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  {...habit} 
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <TeamFeed items={mockFeedItems} />
          </div>
        </div>
      </main>

      <HabitDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        habit={editingHabit}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
      />
    </div>
  );
};

export default Dashboard;
