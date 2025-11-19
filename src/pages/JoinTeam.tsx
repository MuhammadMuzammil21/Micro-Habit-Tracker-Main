import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

export default function JoinTeam() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const joinMutation = useMutation({
    mutationFn: () => api.post(`/teams/invite/${code}`),
    onSuccess: (response) => {
      const { teamId, teamName, status } = response.data.data;
      toast({
        title: status === 'pending' ? "Join Request Sent" : "Successfully Joined!",
        description: status === 'pending'
          ? `Your request to join ${teamName} has been sent. Waiting for admin approval.`
          : `You've successfully joined ${teamName}!`,
      });
      navigate(`/teams/${teamId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to join team",
        variant: "destructive",
      });
    },
  });

  const handleJoin = () => {
    if (!code) {
      toast({
        title: "Invalid Invite Code",
        description: "No invite code provided",
        variant: "destructive",
      });
      return;
    }
    joinMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-2xl mx-auto">
        <Card className="p-8 glass-card text-center">
          <div className="mb-6">
            <Logo size="lg" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Join Team</h1>
          
          {joinMutation.isSuccess ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-success/10">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                You've successfully joined the team!
              </p>
              <Button onClick={() => navigate('/teams')} className="gradient-primary">
                Go to Teams
              </Button>
            </div>
          ) : joinMutation.isError ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-destructive/10">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                Unable to join team. The invite code may be invalid or expired.
              </p>
              <Button onClick={() => navigate('/teams')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teams
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                You've been invited to join a team! Click the button below to accept the invitation.
              </p>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Invite Code</p>
                <p className="font-mono text-lg font-bold">{code}</p>
              </div>
              
              <Button 
                onClick={handleJoin}
                disabled={joinMutation.isPending}
                className="w-full gradient-primary"
                size="lg"
              >
                {joinMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Team"
                )}
              </Button>
              
              <Button 
                onClick={() => navigate('/teams')}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

