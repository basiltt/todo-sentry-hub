
import { User } from "./auth";

export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  userName: string;
  createdAt: Date;
  dueDate: Date;
  time: string;
  category?: string;
}

// Local storage key for mock reminders
const REMINDERS_STORAGE_KEY = "mock_reminders";

// Get auth token from local storage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Initialize mock reminders in localStorage if not already present
const initializeMockReminders = () => {
  if (!localStorage.getItem(REMINDERS_STORAGE_KEY)) {
    const initialReminders = [
      {
        id: "reminder-1",
        text: "Team meeting at 3:00 PM",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        time: "3:00 PM",
        category: "Work"
      },
      {
        id: "reminder-2",
        text: "Submit project proposal",
        completed: true,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        time: "5:00 PM",
        category: "Work"
      },
      {
        id: "reminder-3",
        text: "Client call",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        time: "10:30 AM",
        category: "Work"
      },
      {
        id: "reminder-4",
        text: "Review marketing materials",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        time: "2:00 PM",
        category: "Work"
      },
      {
        id: "reminder-5",
        text: "Dentist appointment",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        time: "4:30 PM",
        category: "Personal"
      },
      {
        id: "reminder-6",
        text: "Quarterly review",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: "11:00 AM",
        category: "Work"
      },
      {
        id: "reminder-7",
        text: "Project deadline",
        completed: false,
        userId: "default-user",
        userName: "Default User",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        time: "5:00 PM",
        category: "Work"
      }
    ];
    
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(initialReminders));
  }
};

// Get reminders for a user
export const getReminders = async (currentUser: User): Promise<Reminder[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  try {
    // Initialize mock reminders if not already done
    initializeMockReminders();
    
    // Get reminders from localStorage
    const remindersJson = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const allReminders = JSON.parse(remindersJson || '[]');
    
    // Filter reminders based on user role
    const userReminders = currentUser.role === 'admin' 
      ? allReminders 
      : allReminders.filter((reminder: Reminder) => reminder.userId === currentUser.id);
    
    // Convert string dates to Date objects
    return userReminders.map((reminder: any) => ({
      ...reminder,
      createdAt: new Date(reminder.createdAt),
      dueDate: new Date(reminder.dueDate),
    }));
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
};

// Add a new reminder
export const addReminder = async (
  text: string, 
  time: string,
  dueDate: Date = new Date(),
  category: string = "Personal",
  currentUser: User
): Promise<Reminder> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    // Initialize mock reminders if not already done
    initializeMockReminders();
    
    // Get existing reminders
    const remindersJson = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const reminders = JSON.parse(remindersJson || '[]');
    
    // Create a new reminder
    const newReminder = {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      time,
      category
    };
    
    // Add the new reminder to the list
    reminders.unshift(newReminder);
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    
    // Return the new reminder with date fields as Date objects
    return {
      ...newReminder,
      createdAt: new Date(newReminder.createdAt),
      dueDate: new Date(newReminder.dueDate),
    };
  } catch (error) {
    console.error("Error adding reminder:", error);
    throw error;
  }
};

// Toggle reminder completion status
export const toggleReminderComplete = async (id: string, currentUser: User): Promise<Reminder> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    // Initialize mock reminders if not already done
    initializeMockReminders();
    
    // Get existing reminders
    const remindersJson = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const reminders = JSON.parse(remindersJson || '[]');
    
    // Find the reminder to toggle
    const reminderIndex = reminders.findIndex((reminder: Reminder) => reminder.id === id);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    // Check if user is authorized to modify this reminder
    if (currentUser.role !== 'admin' && reminders[reminderIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this reminder');
    }
    
    // Toggle the completion status
    reminders[reminderIndex].completed = !reminders[reminderIndex].completed;
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    
    // Return the updated reminder with date fields as Date objects
    return {
      ...reminders[reminderIndex],
      createdAt: new Date(reminders[reminderIndex].createdAt),
      dueDate: new Date(reminders[reminderIndex].dueDate),
    };
  } catch (error) {
    console.error("Error toggling reminder:", error);
    throw error;
  }
};

// Edit a reminder
export const editReminder = async (
  id: string, 
  text: string, 
  time: string,
  dueDate: Date,
  category: string,
  currentUser: User
): Promise<Reminder> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    // Initialize mock reminders if not already done
    initializeMockReminders();
    
    // Get existing reminders
    const remindersJson = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const reminders = JSON.parse(remindersJson || '[]');
    
    // Find the reminder to edit
    const reminderIndex = reminders.findIndex((reminder: Reminder) => reminder.id === id);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    // Check if user is authorized to modify this reminder
    if (currentUser.role !== 'admin' && reminders[reminderIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to modify this reminder');
    }
    
    // Update the reminder
    reminders[reminderIndex].text = text;
    reminders[reminderIndex].time = time;
    reminders[reminderIndex].dueDate = dueDate.toISOString();
    reminders[reminderIndex].category = category;
    
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    
    // Return the updated reminder with date fields as Date objects
    return {
      ...reminders[reminderIndex],
      createdAt: new Date(reminders[reminderIndex].createdAt),
      dueDate: new Date(reminders[reminderIndex].dueDate),
    };
  } catch (error) {
    console.error("Error editing reminder:", error);
    throw error;
  }
};

// Delete a reminder
export const deleteReminder = async (id: string, currentUser: User): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    // Initialize mock reminders if not already done
    initializeMockReminders();
    
    // Get existing reminders
    const remindersJson = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const reminders = JSON.parse(remindersJson || '[]');
    
    // Find the reminder to delete
    const reminderIndex = reminders.findIndex((reminder: Reminder) => reminder.id === id);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    // Check if user is authorized to delete this reminder
    if (currentUser.role !== 'admin' && reminders[reminderIndex].userId !== currentUser.id) {
      throw new Error('Unauthorized to delete this reminder');
    }
    
    // Remove the reminder from the list
    reminders.splice(reminderIndex, 1);
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
};

// Group reminders by date (Today, Tomorrow, Upcoming)
export const groupRemindersByDate = (reminders: Reminder[]): { title: string; reminders: Reminder[] }[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const groups: { title: string; reminders: Reminder[] }[] = [
    { title: "Today", reminders: [] },
    { title: "Tomorrow", reminders: [] },
    { title: "Upcoming", reminders: [] }
  ];
  
  reminders.forEach(reminder => {
    const reminderDate = new Date(reminder.dueDate);
    reminderDate.setHours(0, 0, 0, 0);
    
    if (reminderDate.getTime() === today.getTime()) {
      groups[0].reminders.push(reminder);
    } else if (reminderDate.getTime() === tomorrow.getTime()) {
      groups[1].reminders.push(reminder);
    } else if (reminderDate > today) {
      groups[2].reminders.push(reminder);
    }
  });
  
  // Only return groups that have reminders
  return groups.filter(group => group.reminders.length > 0);
};
