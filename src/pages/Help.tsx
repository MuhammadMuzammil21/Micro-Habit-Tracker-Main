import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, MessageCircle, Mail, ExternalLink, Search } from "lucide-react";

export default function Help() {
  const faqs = [
    {
      question: "How do I create a new habit?",
      answer: "Click the 'New Habit' button in the navigation bar, fill in the habit details including title, description, and frequency, then click 'Create Habit'."
    },
    {
      question: "How do team habits work?",
      answer: "Team habits are shared across all team members. When you create a habit and assign it to a team, all members can track their individual progress while seeing team activity in the feed."
    },
    {
      question: "What are streaks and how are they calculated?",
      answer: "A streak is the number of consecutive days you've completed a habit. For daily habits, you must complete them each day. For weekly habits, you must complete them once per week to maintain your streak."
    },
    {
      question: "Can I edit or delete a habit?",
      answer: "Yes! Click on any habit card to view its details, where you'll find options to edit the habit settings or delete it entirely. Note that deleting a habit will remove all associated progress data."
    },
    {
      question: "How do I invite team members?",
      answer: "Go to the Teams page, select your team, and click the 'Invite Members' button. You can send invitations via email to anyone you'd like to join your team."
    },
    {
      question: "What do the analytics show?",
      answer: "The Analytics page displays your completion rates, streaks, habit breakdowns, and trends over time. You can view both personal statistics and team leaderboards to see how you compare with teammates."
    },
    {
      question: "How do I change notification settings?",
      answer: "Navigate to Settings > Notifications where you can customize email notifications, push notifications, and set your preferred reminder times for habits."
    },
    {
      question: "Can I export my habit data?",
      answer: "Yes! Go to Settings > Account and scroll to the Data Management section where you'll find an option to export all your habit data in CSV format."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Find answers and get help with HabitLink</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 glass-card">
            <div className="space-y-4">
              <Label htmlFor="search">Search Help Articles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Search for help..." className="pl-10" />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 glass-card hover:shadow-medium transition-smooth cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Book className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Browse our comprehensive guides and tutorials
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  View Docs
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 glass-card hover:shadow-medium transition-smooth cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community forum and connect with other users
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  Visit Forum
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 glass-card hover:shadow-medium transition-smooth cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized help from our support team
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  Email Us
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-2xl font-semibold mb-4">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="help-name">Name</Label>
                  <Input id="help-name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="help-email">Email</Label>
                  <Input id="help-email" type="email" placeholder="your.email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="help-subject">Subject</Label>
                <Input id="help-subject" placeholder="What do you need help with?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="help-message">Message</Label>
                <Textarea id="help-message" placeholder="Describe your issue or question..." rows={5} />
              </div>
              <Button className="gradient-primary">Send Message</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
