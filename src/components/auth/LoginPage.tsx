import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "../../components/ui/use-toast";

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await login(values);
      toast({
        title: "Login successful",
        description: "Welcome back to the Blood Bank Management System",
        variant: "default",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      await register(values);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
        variant: "default",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
