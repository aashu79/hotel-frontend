import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Lock, Mail, ShieldCheck } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

const StaffLogin = () => {
  const navigate = useNavigate();
  const { error, isLoading, loginStaffAdmin, clearError } = useAuthStore();

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});

  // Clear errors when component unmounts or when input changes
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    // Clear auth errors when user starts typing
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData.email, loginData.password]);

  const validateLoginForm = () => {
    const errors: Partial<LoginFormData> = {};
    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(loginData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    // Clear field-specific error when user types
    if (loginErrors[e.target.name as keyof LoginFormData]) {
      setLoginErrors({ ...loginErrors, [e.target.name]: undefined });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      const success = await loginStaffAdmin(
        loginData.email,
        loginData.password
      );
      if (success) {
        // Get user from store after successful login
        const user = useAuthStore.getState().user;
        // Redirect based on role
        if (user?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-slate-700/50 bg-slate-800/90 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Staff Portal
            </CardTitle>
            <CardDescription className="text-center text-slate-400 text-base">
              Sign in to access the management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-500/50 bg-red-950/50"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    placeholder="staff@himalayan.com"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20 h-11"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-200 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-900/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20 h-11"
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-center text-sm text-slate-400">
                Authorized personnel only
              </p>
              <p className="text-center text-xs text-slate-500 mt-2">
                Contact your administrator for access
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to home link */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          >
            ← Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLogin;
