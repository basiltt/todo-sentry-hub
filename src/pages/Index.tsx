
import { Link } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/lib/auth";
import { ArrowRight, CheckCircle, ShieldCheck, Clock } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Effortless Task Management",
      description: "Create, update, and organize your tasks with a clean, intuitive interface designed for clarity and efficiency."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: "Role-Based Access Control",
      description: "Secure, permission-based system where admins can see all tasks while users see only their own."
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Real-Time Updates",
      description: "Changes reflect instantly with smooth animations, making collaboration seamless and efficient."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 bg-white/80 backdrop-blur-md dark:bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
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
                  className="w-5 h-5 text-primary"
                >
                  <path d="M11 20h4"></path>
                  <path d="M12 4v16"></path>
                  <path d="M18 8l-6 6-6-6"></path>
                </svg>
              </div>
            </div>
            <span className="font-semibold tracking-tight">TodoFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ButtonCustom asChild>
                <Link to="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </ButtonCustom>
            ) : (
              <>
                <ButtonCustom variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </ButtonCustom>
                <ButtonCustom asChild>
                  <Link to="/register">Sign up</Link>
                </ButtonCustom>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 bg-gradient-to-b from-secondary to-transparent dark:from-background">
        <div className="container px-4 pt-16 pb-20 md:pb-32 flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 border border-border rounded-full bg-background dark:bg-card animate-slide-down">
            <span className="text-xs font-medium">Simplify your task management</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            Beautiful, minimalist task management
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
            TodoFlow helps you organize your work with clarity and elegance. The perfect blend of simplicity and functionality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <ButtonCustom asChild size="lg" className="h-12 w-full sm:w-auto">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? "Go to dashboard" : "Get started for free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </ButtonCustom>
            {!isAuthenticated && (
              <ButtonCustom asChild variant="outline" size="lg" className="h-12 w-full sm:w-auto">
                <Link to="/login">Sign in</Link>
              </ButtonCustom>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white dark:bg-card">
        <div className="container px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Designed with purpose
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining beautiful design with powerful functionality to create an experience that feels effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-slide-up">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-secondary/50 dark:bg-background rounded-xl p-6 border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-secondary to-transparent dark:from-accent/10 dark:to-transparent">
        <div className="container px-4 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your workflow?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who trust TodoFlow for their task management needs.
          </p>

          <ButtonCustom asChild size="lg" className="h-12">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to dashboard" : "Get started for free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </ButtonCustom>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-card border-t border-border py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative w-8 h-8 mr-2">
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
                    className="w-5 h-5 text-primary"
                  >
                    <path d="M11 20h4"></path>
                    <path d="M12 4v16"></path>
                    <path d="M18 8l-6 6-6-6"></path>
                  </svg>
                </div>
              </div>
              <span className="font-semibold tracking-tight">TodoFlow</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2023 TodoFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
