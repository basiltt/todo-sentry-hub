
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Bell, Plus, ChevronDown, CheckCircle2, Circle, Tag, Trash2, Edit, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/use-auth";
import { Reminder, getReminders, addReminder, toggleReminderComplete, editReminder, deleteReminder, groupRemindersByDate } from "@/lib/reminder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reminders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newReminder, setNewReminder] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("12:00 PM");
  const [newReminderCategory, setNewReminderCategory] = useState("Personal");
  
  // Edit modal state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [editText, setEditText] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editCategory, setEditCategory] = useState("");
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingReminderId, setDeletingReminderId] = useState<string | null>(null);

  // Fetch reminders
  const { data: reminders, isLoading, isError } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => getReminders(user!),
    enabled: !!user,
  });

  // Group reminders
  const reminderGroups = reminders ? groupRemindersByDate(reminders) : [];

  // Add reminder mutation
  const addReminderMutation = useMutation({
    mutationFn: ({ text, time, category }: { text: string, time: string, category: string }) => 
      addReminder(text, time, new Date(), category, user!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success("Reminder added successfully");
      setNewReminder("");
    },
    onError: (error) => {
      toast.error(`Failed to add reminder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  // Toggle reminder status mutation
  const toggleReminderMutation = useMutation({
    mutationFn: (id: string) => toggleReminderComplete(id, user!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: (error) => {
      toast.error(`Failed to update reminder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  // Edit reminder mutation
  const editReminderMutation = useMutation({
    mutationFn: ({ id, text, time, dueDate, category }: { id: string, text: string, time: string, dueDate: Date, category: string }) => 
      editReminder(id, text, time, dueDate, category, user!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      setIsEditDialogOpen(false);
      toast.success("Reminder updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update reminder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: (id: string) => deleteReminder(id, user!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      setIsDeleteDialogOpen(false);
      toast.success("Reminder deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete reminder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.trim()) {
      addReminderMutation.mutate({ 
        text: newReminder, 
        time: newReminderTime,
        category: newReminderCategory
      });
    }
  };

  const openEditDialog = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditText(reminder.text);
    setEditTime(reminder.time);
    setEditCategory(reminder.category || "Personal");
    setIsEditDialogOpen(true);
  };

  const handleEditReminder = () => {
    if (!editingReminder) return;
    
    editReminderMutation.mutate({
      id: editingReminder.id,
      text: editText,
      time: editTime,
      dueDate: editingReminder.dueDate,
      category: editCategory
    });
  };

  const openDeleteDialog = (id: string) => {
    setDeletingReminderId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteReminder = () => {
    if (deletingReminderId) {
      deleteReminderMutation.mutate(deletingReminderId);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">Failed to load reminders. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

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
                <div className="space-y-2">
                  <Input
                    placeholder="Add a reminder..."
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    className="h-9"
                  />
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select 
                        value={newReminderTime} 
                        onValueChange={setNewReminderTime}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                          <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                          <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                          <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Select 
                        value={newReminderCategory} 
                        onValueChange={setNewReminderCategory}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Work">Work</SelectItem>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <ButtonCustom 
                    type="submit" 
                    className="w-full h-9"
                    disabled={!newReminder.trim() || addReminderMutation.isPending}
                  >
                    {addReminderMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Reminder
                      </>
                    )}
                  </ButtonCustom>
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
            {reminderGroups.length > 0 ? (
              <div className="space-y-6">
                {reminderGroups.map((group) => (
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
                      {group.reminders.map((reminder) => (
                        <div 
                          key={reminder.id}
                          className="p-3 hover:bg-secondary/50"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleReminderMutation.mutate(reminder.id)}
                              className="mt-0.5"
                              aria-label={reminder.completed ? "Mark as incomplete" : "Mark as complete"}
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
                                
                                {reminder.category && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    <span>{reminder.category}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <ButtonCustom 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => openEditDialog(reminder)}
                                aria-label="Edit reminder"
                              >
                                <Edit className="h-4 w-4" />
                              </ButtonCustom>
                              
                              <ButtonCustom 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => openDeleteDialog(reminder.id)}
                                aria-label="Delete reminder"
                              >
                                <Trash2 className="h-4 w-4" />
                              </ButtonCustom>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No reminders found</h3>
                <p className="text-muted-foreground mb-4">Add your first reminder to get started.</p>
                <ButtonCustom 
                  className="mx-auto" 
                  onClick={() => document.querySelector('input')?.focus()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </ButtonCustom>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Reminder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-text">Reminder</Label>
              <Input
                id="edit-text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Select value={editTime} onValueChange={setEditTime}>
                <SelectTrigger id="edit-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <ButtonCustom 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom 
              onClick={handleEditReminder}
              disabled={!editText.trim() || editReminderMutation.isPending}
            >
              {editReminderMutation.isPending ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </ButtonCustom>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this reminder? This action cannot be undone.</p>
          <DialogFooter>
            <ButtonCustom 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom 
              variant="destructive"
              onClick={handleDeleteReminder}
              disabled={deleteReminderMutation.isPending}
            >
              {deleteReminderMutation.isPending ? <LoadingSpinner size="sm" /> : "Delete"}
            </ButtonCustom>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reminders;
