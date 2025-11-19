import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, Trophy, Users, TrendingUp, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "achievement":
      return Trophy;
    case "team":
      return Users;
    case "milestone":
      return TrendingUp;
    default:
      return Bell;
  }
};

export default function Notifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all notifications
  const { data: allNotifications = [], isLoading } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.data || [];
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "All notifications marked as read",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to mark notifications as read",
        variant: "destructive",
      });
    },
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error);
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast({
        title: "Notification deleted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const unreadCount = allNotifications.filter((n: any) => !n.read).length;

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
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending || unreadCount === 0}
            >
              {markAllReadMutation.isPending ? "Marking..." : "Mark All as Read"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card border border-border/50">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {allNotifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-3">
                {allNotifications.length === 0 ? (
                  <Card className="p-12 glass-card text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
                    <p className="text-muted-foreground">
                      When you have new updates, they'll appear here
                    </p>
                  </Card>
                ) : (
                  allNotifications.map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                          !notification.read ? "border-primary/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          if (!notification.read) {
                            markAsReadMutation.mutate(notification.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 -mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            disabled={deleteMutation.isPending}
                          >
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
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {allNotifications.filter((n: any) => !n.read).length === 0 ? (
                  <Card className="p-12 glass-card text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No unread notifications</h3>
                  </Card>
                ) : (
                  allNotifications.filter((n: any) => !n.read).map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className="p-4 glass-card hover:shadow-medium transition-smooth border-primary/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              if (!notification.read) {
                                markAsReadMutation.mutate(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 -mt-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                disabled={deleteMutation.isPending}
                              >
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
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-3">
                {allNotifications.filter((n: any) => n.type === "achievement" || n.type === "milestone").length === 0 ? (
                  <Card className="p-12 glass-card text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                  </Card>
                ) : (
                  allNotifications.filter((n: any) => n.type === "achievement" || n.type === "milestone").map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                          !notification.read ? "border-primary/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              if (!notification.read) {
                                markAsReadMutation.mutate(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 -mt-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="team" className="space-y-3">
                {allNotifications.filter((n: any) => n.type === "team").length === 0 ? (
                  <Card className="p-12 glass-card text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No team notifications</h3>
                  </Card>
                ) : (
                  allNotifications.filter((n: any) => n.type === "team").map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className={`p-4 glass-card hover:shadow-medium transition-smooth ${
                          !notification.read ? "border-primary/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-primary/10 ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              if (!notification.read) {
                                markAsReadMutation.mutate(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 -mt-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

      </main>
    </div>
  );
}
