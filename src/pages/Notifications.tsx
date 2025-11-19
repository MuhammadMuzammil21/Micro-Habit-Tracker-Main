import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, Trophy, Users, TrendingUp, X } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: "1",
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've completed 30 consecutive days of Morning Exercise",
      time: "5 minutes ago",
      read: false,
      icon: Trophy,
    },
    {
      id: "2",
      type: "team",
      title: "New Team Member",
      message: "Emma Watson joined Engineering Team",
      time: "1 hour ago",
      read: false,
      icon: Users,
    },
    {
      id: "3",
      type: "habit",
      title: "Habit Reminder",
      message: "Don't forget to complete your meditation today!",
      time: "2 hours ago",
      read: true,
      icon: Bell,
    },
    {
      id: "4",
      type: "milestone",
      title: "Streak Milestone",
      message: "Sarah Kim reached a 50-day streak on Reading",
      time: "3 hours ago",
      read: true,
      icon: TrendingUp,
    },
    {
      id: "5",
      type: "team",
      title: "Team Achievement",
      message: "Engineering Team completed 100 total habits this week!",
      time: "1 day ago",
      read: true,
      icon: Trophy,
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "text-yellow-500";
      case "team":
        return "text-blue-500";
      case "milestone":
        return "text-purple-500";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your habits and team activity</p>
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass-card border border-border/50">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="secondary" className="ml-2">
                {notifications.filter(n => !n.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                  !notification.read ? "border-primary/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                    <notification.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <Card
                  key={notification.id}
                  className="p-4 glass-card hover:shadow-medium transition-smooth border-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          New
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3">
            {notifications
              .filter((n) => n.type === "achievement" || n.type === "milestone")
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                    !notification.read ? "border-primary/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="team" className="space-y-3">
            {notifications
              .filter((n) => n.type === "team")
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                    !notification.read ? "border-primary/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        {notifications.length === 0 && (
          <Card className="p-12 glass-card text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              When you have new updates, they'll appear here
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
