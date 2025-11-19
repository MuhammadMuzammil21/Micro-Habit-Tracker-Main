import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, Users } from "lucide-react";
import api from "@/lib/api";

interface TeamLeaderboardProps {
  teamId: string;
  teamName: string;
}

export const TeamLeaderboard = ({ teamId, teamName }: TeamLeaderboardProps) => {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['team-leaderboard', teamId],
    queryFn: async () => {
      try {
        const response = await api.get(`/analytics/team/${teamId}/leaderboard`);
        return response.data.data || [];
      } catch (error) {
        return [];
      }
    },
    enabled: !!teamId,
  });

  if (isLoading) {
    return (
      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold mb-4">{teamName} Leaderboard</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold mb-4">{teamName} Leaderboard</h3>
        <div className="text-center py-8 text-muted-foreground">
          No leaderboard data available yet
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card">
      <h3 className="text-lg font-semibold mb-4">{teamName} Leaderboard</h3>
      <div className="space-y-3">
        {leaderboard.map((member: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                {index === 0 ? <Crown className="h-4 w-4" /> : `#${index + 1}`}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(member.completionRate)}% completion rate
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-accent text-accent">
              🔥 {member.streak} day streak
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

