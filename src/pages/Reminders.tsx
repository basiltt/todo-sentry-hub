
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Bell, Plus, ChevronDown, CheckCircle2, Circle, Tag } from "lucide-react";

const Reminders = () => {
  const [newReminder, setNewReminder] = useState("");
  
  // Mock reminder data
  const reminderGroups = [
    {
      title: "Today",
      reminders: [
        { id: 1, text: "Team meeting at 3:00 PM", time: "3:00 PM", completed: false },
        { id: 2, text: "Submit project proposal", time: "5:00 PM", completed: true }
      ]
    },
    {
      title: "Tomorrow",
      reminders: [
        { id: 3, text: "Client call", time: "10:30 AM", completed: false },
        { id: 4, text: "Review marketing materials", time: "2:00 PM", completed: false },
        { id: 5, text: "Dentist appointment", time: "4:30 PM", completed: false }
      ]
    },
    {
      title: "Upcoming",
      reminders: [
        { id: 6, text: "Quarterly review", time: "March 15, 11:00 AM", completed: false },
        { id: 7, text: "Project deadline", time: "March 20, 5:00 PM", completed: false }
      ]
    }
  ];

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.trim()) {
      // In a real app, this would add the reminder to the state or backend
      // For this demo, we'll just clear the input
      setNewReminder("");
      console.log("Added reminder:", newReminder);
    }
  };

  const toggleReminderStatus = (groupIndex: number, reminderIndex: number) => {
    console.log("Toggled reminder status:", 
      reminderGroups[groupIndex].reminders[reminderIndex].text);
    // In a real app, this would update the reminder status
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
            <p className="text-muted-foreground">
              Never miss an important deadline
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ButtonCustom variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">View Calendar</span>
            </ButtonCustom>
            <ButtonCustom size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Reminder</span>
            </ButtonCustom>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-72">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-3">Quick Add</h3>
              <form onSubmit={handleAddReminder} className="mb-6">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a reminder..."
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    className="h-9"
                  />
                  <ButtonCustom 
                    type="submit" 
                    size="sm" 
                    disabled={!newReminder.trim()}
                    className="h-9 px-3"
                  >
                    Add
                  </ButtonCustom>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  <span>Reminder set for today</span>
                </div>
              </form>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-1">Categories</h3>
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                  Personal
                </ButtonCustom>
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  Work
                </ButtonCustom>
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                  Family
                </ButtonCustom>
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Urgent
                </ButtonCustom>
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Category
                </ButtonCustom>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <div className="space-y-6">
              {reminderGroups.map((group, groupIndex) => (
                <Card key={group.title} className="overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{group.title}</h3>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        {group.reminders.filter(r => !r.completed).length}
                      </span>
                    </div>
                    <ButtonCustom variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </ButtonCustom>
                  </div>
                  
                  <div className="divide-y">
                    {group.reminders.map((reminder, reminderIndex) => (
                      <div 
                        key={reminder.id}
                        className="p-3 hover:bg-secondary/50"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleReminderStatus(groupIndex, reminderIndex)}
                            className="mt-0.5"
                          >
                            {reminder.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <p className={`${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                              {reminder.text}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{reminder.time}</span>
                              </div>
                              
                              {groupIndex === 0 && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{reminderIndex === 0 ? "Work" : "Personal"}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <ButtonCustom variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Bell className="h-4 w-4" />
                          </ButtonCustom>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reminders;
