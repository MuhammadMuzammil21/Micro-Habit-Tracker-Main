import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Crown, 
  TrendingUp, 
  Target, 
  Loader2, 
  ArrowLeft, 
  Settings, 
  Trash2,
  LogOut,
  Edit,
  Share2,
  Copy,
  Mail
} from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { HabitCard } from "@/components/HabitCard";
import { joinTeamRoom, leaveTeamRoom, onFeedUpdate, onLeaderboardUpdate, getSocket } from "@/lib/socket";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Fetch team details
  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await api.get(`/teams/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  // Fetch team habits
  const { data: teamHabits = [] } = useQuery({
    queryKey: ['team-habits', id],
    queryFn: async () => {
      const response = await api.get('/habits');
      // Filter habits for this team
      return (response.data.data || []).filter((habit: any) => habit.teamId === id);
    },
    enabled: !!id,
  });

  // Fetch team leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['team-leaderboard', id],
    queryFn: async () => {
      const response = await api.get(`/analytics/team/${id}/leaderboard`);
      return response.data.data || [];
    },
    enabled: !!id,
  });

  // Join team room for real-time updates
  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    if (socket?.connected) {
      joinTeamRoom(id);

      // Listen for feed updates
      const handleFeedUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ['team-habits', id] });
      };

      // Listen for leaderboard updates
      const handleLeaderboardUpdate = (data: any) => {
        if (data.teamId === id) {
          queryClient.invalidateQueries({ queryKey: ['team-leaderboard', id] });
        }
      };

      onFeedUpdate(handleFeedUpdate);
      onLeaderboardUpdate(handleLeaderboardUpdate);

      return () => {
        leaveTeamRoom(id);
      };
    }
  }, [id, queryClient]);

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => api.put(`/teams/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', id] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Team Updated",
        description: "Team information has been updated successfully.",
      });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update team",
        variant: "destructive",
      });
    },
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: () => api.delete(`/teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Team Deleted",
        description: "Team has been deleted successfully.",
      });
      navigate('/teams');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete team",
        variant: "destructive",
      });
    },
  });

  // Leave team mutation
  const leaveTeamMutation = useMutation({
    mutationFn: () => api.post(`/teams/${id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Left Team",
        description: "You have left the team successfully.",
      });
      navigate('/teams');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to leave team",
        variant: "destructive",
      });
    },
  });

  // Generate invite link mutation
  const generateInviteMutation = useMutation({
    mutationFn: (data: { email?: string; expiresInDays?: number }) => 
      api.post(`/teams/${id}/invite`, data),
    onSuccess: (response) => {
      const { inviteCode, inviteLink } = response.data.data;
      setInviteCode(inviteCode);
      setInviteLink(inviteLink);
      toast({
        title: "Invite Link Generated",
        description: inviteEmail 
          ? "Invitation email sent successfully!" 
          : "Invite link generated. Share it with your team members.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to generate invite link",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (team) {
      setTeamName(team.name);
      setTeamDescription(team.description || "");
      setEditDialogOpen(true);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }
    updateTeamMutation.mutate({ name: teamName, description: teamDescription });
  };

  const handleDelete = () => {
    deleteTeamMutation.mutate();
  };

  const handleLeave = () => {
    leaveTeamMutation.mutate();
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    generateInviteMutation.mutate({ 
      email: inviteEmail || undefined,
      expiresInDays: 7 
    });
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-8 max-w-7xl mx-auto">
          <Card className="p-12 glass-card text-center">
            <h2 className="text-2xl font-semibold mb-4">Team Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The team you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/teams')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teams')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold tracking-tight">{team.name}</h1>
                {team.isAdmin && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{team.description || "No description"}</p>
            </div>
            
            <div className="flex gap-2">
              {team.isAdmin && (
                <>
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Invite
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50">
                      <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleGenerateInvite} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="invite-email">Email (Optional)</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="invite-email" 
                              type="email"
                              placeholder="team.member@example.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="pl-10"
                              disabled={generateInviteMutation.isPending}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Leave empty to just generate a link
                          </p>
                        </div>
                        
                        {inviteLink && (
                          <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
                            <Label>Invite Link</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={inviteLink}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleCopyInviteLink}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Share this link with team members. Expires in 7 days.
                            </p>
                          </div>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full gradient-primary"
                          disabled={generateInviteMutation.isPending}
                        >
                          {generateInviteMutation.isPending ? "Generating..." : inviteLink ? "Generate New Link" : "Generate Invite Link"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50">
                      <DialogHeader>
                        <DialogTitle>Edit Team</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-team-name">Team Name</Label>
                          <Input 
                            id="edit-team-name" 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                            disabled={updateTeamMutation.isPending}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-team-description">Description</Label>
                          <Textarea 
                            id="edit-team-description" 
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            rows={3}
                            disabled={updateTeamMutation.isPending}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full gradient-primary"
                          disabled={updateTeamMutation.isPending}
                        >
                          {updateTeamMutation.isPending ? "Updating..." : "Update Team"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50">
                      <DialogHeader>
                        <DialogTitle>Delete Team</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <p className="text-muted-foreground">
                          Are you sure you want to delete this team? This action cannot be undone and will remove all team data.
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={deleteTeamMutation.isPending}
                            className="flex-1"
                          >
                            {deleteTeamMutation.isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              {!team.isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={handleLeave}
                  disabled={leaveTeamMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Team
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 glass-card">
              <h2 className="text-2xl font-semibold mb-4">Team Habits</h2>
              {teamHabits.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No habits in this team yet. Create a habit and assign it to this team!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamHabits.map((habit: any) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Team Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Members</span>
                  </div>
                  <span className="text-xl font-bold">{team.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Active Habits</span>
                  </div>
                  <span className="text-xl font-bold">{team.activeHabits}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Members</h3>
              <div className="space-y-3">
                {team.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    {member.role === 'admin' && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Crown className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {leaderboard.length > 0 && (
              <Card className="p-6 glass-card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-6">#{index + 1}</span>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          🔥 {member.streak} day streak
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(member.completionRate)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

