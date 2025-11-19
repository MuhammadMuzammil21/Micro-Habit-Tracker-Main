import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Award, Users } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
}

const StatCard = ({ icon, label, value, trend }: StatCardProps) => (
  <Card className="p-6 glass-card hover:shadow-medium transition-smooth group">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">{icon}</div>
      {trend && (
        <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold mb-1 tracking-tight">{value}</p>
    <p className="text-sm text-muted-foreground font-medium">{label}</p>
  </Card>
);

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Target className="h-5 w-5" />}
        label="Active Habits"
        value={8}
        trend="+2 this week"
      />
      <StatCard
        icon={<Award className="h-5 w-5" />}
        label="Completion Rate"
        value="87%"
        trend="+5%"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Longest Streak"
        value="23 days"
      />
      <StatCard
        icon={<Users className="h-5 w-5" />}
        label="Team Members"
        value={5}
      />
    </div>
  );
};
