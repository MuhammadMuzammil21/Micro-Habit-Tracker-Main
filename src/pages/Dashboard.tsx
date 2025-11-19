import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { HabitCard } from "@/components/HabitCard";
import { TeamFeed } from "@/components/TeamFeed";
import { StatsOverview } from "@/components/StatsOverview";
import { HabitDialog } from "@/components/HabitDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { onFeedUpdate, onLeaderboardUpdate, getSocket } from "@/lib/socket";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  // Fetch habits
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const response = await api.get('/habits');
      return response.data.data;
    },
  });

  // Fetch team feed
  const { data: teamFeed = [], refetch: refetchFeed } = useQuery({
    queryKey: ['team-feed'],
    queryFn: async () => {
      try {
        const response = await api.get('/analytics/feed');
        return response.data.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  // Set up real-time Socket.io listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket?.connected) return;

    // Listen for feed updates
    const handleFeedUpdate = (data: any) => {
      queryClient.setQueryData(['team-feed'], (old: any) => {
        // Add new item to the beginning of the feed
        return [data, ...(old || [])].slice(0, 20); // Keep last 20 items
      });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    // Listen for leaderboard updates
    const handleLeaderboardUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['team-leaderboard'] });
    };

    onFeedUpdate(handleFeedUpdate);
    onLeaderboardUpdate(handleLeaderboardUpdate);

    return () => {
      // Cleanup listeners if needed
    };
  }, [queryClient]);

  // Create habit mutation
  const createMutation = useMutation({
    mutationFn: (habitData: any) => api.post('/habits', habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: "Habit Created",
        description: "Your new habit has been created successfully.",
      });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  // Update habit mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/habits/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: "Habit Updated",
        description: "Your habit has been updated successfully.",
      });
      setDialogOpen(false);
      setEditingHabit(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  // Delete habit mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/habits/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: "Habit Deleted",
        description: "The habit has been removed from your list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete habit",
        variant: "destructive",
      });
    },
  });

  const handleCreateHabit = (habitData: any) => {
    createMutation.mutate(habitData);
  };

  const handleEditHabit = (id: string) => {
    const habit = habits.find((h: any) => h._id === id);
    if (habit) {
      setEditingHabit(habit);
      setDialogOpen(true);
    }
  };

  const handleUpdateHabit = (updatedHabit: any) => {
    updateMutation.mutate({ id: updatedHabit._id || updatedHabit.id, ...updatedHabit });
  };

  const handleDeleteHabit = (id: string) => {
    deleteMutation.mutate(id);
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
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Track your habits and build consistency. Keep up the great work! 🎉
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

            {habitsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : habits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No habits yet. Create your first habit to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {habits.map((habit: any) => (
                  <HabitCard 
                    key={habit._id} 
                    id={habit._id}
                    title={habit.title}
                    description={habit.description}
                    frequency={habit.frequency}
                    streak={0}
                    completed={false}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <TeamFeed items={teamFeed} />
          </div>
        </div>
      </main>

      <HabitDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        habit={editingHabit ? {
          id: editingHabit._id,
          title: editingHabit.title,
          description: editingHabit.description,
          frequency: editingHabit.frequency,
        } : undefined}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
      />
    </div>
  );
};

export default Dashboard;
