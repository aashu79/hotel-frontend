import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Signup failed', description: 'Passwords do not match' });
      return;
    }

    try {
      setIsLoading(true);
      const payload = { name: formData.name, email: formData.email, password: formData.password, number: formData.phone };
      const response = await axios.post('http://localhost:3000/auth/signup', payload);
      const data = response.data;
      toast({ title: 'Account created', description: data?.user?.email || 'Welcome!' });
      if (data?.token) {
        login(data.token);
      } else {
        // fallback to mark session as logged in if backend doesn't return a token yet
        login('session');
      }
      navigate('/');
      console.log(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Signup failed';
      toast({ title: 'Signup failed', description: message });
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
    console.log('Signup attempt:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center pt-24 pb-12 px-6">
      <div className="w-full max-w-md">
        {/* Signup Form */}
        <GlassCard className="p-8 animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-elegant font-bold text-premium mb-4">
              Join Us
            </h1>
            <p className="text-xl text-gray-300">
              Create your account and start your culinary journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-accent-purple focus:ring-accent-purple/20"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-accent-cyan hover:text-accent-purple transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-accent-cyan hover:text-accent-purple transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <label className="flex items-start space-x-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-accent-purple focus:ring-accent-purple/20"
                />
                <span>Subscribe to our newsletter for exclusive offers and updates</span>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button type="submit" disabled={isLoading} className="w-full btn-premium disabled:opacity-60 disabled:cursor-not-allowed transition-transform active:scale-[0.98]">
              {isLoading ? 'Creating…' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Social Signup removed */}

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-orange-400 transition-colors font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </GlassCard>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};