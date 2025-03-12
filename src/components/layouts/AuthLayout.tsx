
import React from "react";
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
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row flex-1">
        {/* Left Side - Branding */}
        <div className="hidden sm:flex sm:w-1/2 bg-primary items-center justify-center p-8">
          <div className="max-w-md text-white animate-fade-in">
            <Link to="/" className="flex items-center mb-12 group">
              <div className="relative w-10 h-10 mr-2">
                <div className="absolute inset-0 bg-white rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <path d="M11 20h4"></path>
                    <path d="M12 4v16"></path>
                    <path d="M18 8l-6 6-6-6"></path>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight">TodoFlow</span>
            </Link>
            
            <h1 className="text-3xl font-bold mb-3">
              Effortless task management designed for clarity
            </h1>
            <p className="text-white/80 mb-8">
              A beautifully simple way to organize your work and life. 
              No clutter, just productivity.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Simple</div>
                <div className="text-sm text-white/70">
                  Clean interface with powerful functionality
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Secure</div>
                <div className="text-sm text-white/70">
                  Role-based access for privacy and control
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="sm:w-1/2 flex flex-col justify-center px-4 py-12 sm:px-12 bg-white dark:bg-background">
          <div className="max-w-md w-full mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{title}</h2>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
