
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  Settings as SettingsIcon, 
  Users, 
  Database, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  HelpCircle,
  Save,
  Switch 
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage system settings and configurations
            </p>
          </div>
          
          <ButtonCustom size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </ButtonCustom>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56">
            <Card className="p-3">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-medium text-muted-foreground">
                  SETTINGS
                </p>
              </div>
              
              <div className="space-y-1">
                <ButtonCustom
                  variant="default"
                  size="sm"
                  className="w-full justify-start"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  General
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Localization
                </ButtonCustom>
                
                <ButtonCustom
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </ButtonCustom>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">General Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Name</h4>
                      <p className="text-sm text-muted-foreground">
                        Name of your organization's task management system
                      </p>
                    </div>
                    <input 
                      type="text" 
                      className="w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      defaultValue="ChronoTask" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Default Time Zone</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the default time zone for new accounts
                      </p>
                    </div>
                    <select
                      className="w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      defaultValue="UTC-5"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Date Format</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose how dates are displayed throughout the application
                      </p>
                    </div>
                    <select
                      className="w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      defaultValue="MM/DD/YYYY"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow New Registrations</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable new user sign-ups
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked="true"
                        data-state="checked"
                        className="relative inline-flex h-5 w-10 items-center rounded-full bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="pointer-events-none block h-4 w-4 translate-x-5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Email Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Require users to verify their email before accessing the system
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked="true"
                        data-state="checked"
                        className="relative inline-flex h-5 w-10 items-center rounded-full bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="pointer-events-none block h-4 w-4 translate-x-5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Put the system in maintenance mode (only admins can access)
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked="false"
                        data-state="unchecked"
                        className="relative inline-flex h-5 w-10 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">System Status</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Users</div>
                        <div className="text-xl font-bold">256</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Tasks</div>
                        <div className="text-xl font-bold">1,432</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Storage</div>
                        <div className="text-xl font-bold">28.4 GB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
