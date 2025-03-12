
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  // Set light mode as default
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-dots-pattern">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-secondary">
        <div>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-primary rounded-lg opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M11 20h4"></path>
                  <path d="M12 4v16"></path>
                  <path d="M18 8l-6 6-6-6"></path>
                </svg>
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight">ChronoTask</span>
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute -left-5 -top-20">
            <div className="w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-float-slow"></div>
          </div>
          <div className="absolute -right-10 -bottom-10">
            <div className="w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-float"></div>
          </div>
          
          <div className="relative bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Task Management Made Simple</h2>
            <p className="text-muted-foreground mb-6">
              Organize, track, and prioritize your tasks with ease. Stay on top of your 
              deadlines and collaborate with your team seamlessly.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="font-bold text-3xl mb-1 text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="bg-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="font-bold text-3xl mb-1 text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ChronoTask. All rights reserved.
        </div>
      </div>
      
      <div className="flex flex-col justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-primary rounded-lg opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M11 20h4"></path>
                  <path d="M12 4v16"></path>
                  <path d="M18 8l-6 6-6-6"></path>
                </svg>
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight">ChronoTask</span>
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          
          <div className="bg-white dark:bg-card shadow-sm border border-border/50 rounded-xl p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
