import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles } from "lucide-react";

interface FeedItem {
  id: string;
  userName: string;
  habitTitle: string;
  timestamp: string;
  streakMilestone?: number;
}

interface TeamFeedProps {
  items: FeedItem[];
}

export const TeamFeed = ({ items }: TeamFeedProps) => {
  return (
    <Card className="p-6 glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Team Activity</h2>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No recent activity. Be the first to complete a habit!
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-smooth"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {item.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{item.userName}</p>
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Completed <span className="font-medium text-foreground">{item.habitTitle}</span>
                </p>
                {item.streakMilestone && (
                  <Badge variant="outline" className="text-xs border-accent text-accent">
                    🔥 {item.streakMilestone} day milestone!
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
