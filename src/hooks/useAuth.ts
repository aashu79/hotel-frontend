import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth";
import { message } from "antd";

// Query Keys
export const AUTH_KEYS = {
  all: ["auth"] as const,
  user: () => [...AUTH_KEYS.all, "user"] as const,
  staff: () => [...AUTH_KEYS.all, "staff"] as const,
};

// Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSendLoginOtp = () => {
  return useMutation({
    mutationFn: authApi.sendLoginOtp,
    onSuccess: () => {
      message.success("OTP sent successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to send OTP");
    },
  });
};

export const useVerifyLoginOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ identifier, otp }: { identifier: string; otp: string }) =>
      authApi.verifyLoginOtp(identifier, otp),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
      message.success("Login successful");
    },
    onError: (error: Error) => {
      message.error("Login failed");
    },
  });
};

export const useSendRegisterOtp = () => {
  return useMutation({
    mutationFn: ({
      name,
      phoneNumber,
    }: {
      name: string;
      phoneNumber: string;
    }) => authApi.sendRegisterOtp(name, phoneNumber),
    onSuccess: () => {
      message.success("OTP sent successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to send OTP");
    },
  });
};

export const useVerifyRegisterOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ identifier, otp }: { identifier: string; otp: string }) =>
      authApi.verifyRegisterOtp(identifier, otp),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
      message.success("Registration successful");
    },
    onError: (error: Error) => {
      message.error("Registration failed");
    },
  });
};

export const useStaffLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.staffLogin(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.staff(), data.user);
      message.success("Staff login successful");
    },
    onError: (error: Error) => {
      message.error("Staff login failed");
    },
  });
};

export const useRegisterStaffAdmin = () => {
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      role,
    }: {
      name: string;
      email: string;
      password: string;
      role: "STAFF" | "ADMIN";
    }) => authApi.registerStaffAdmin(name, email, password, role),
    onSuccess: () => {
      message.success("Staff/Admin registered successfully");
    },
    onError: (error: Error) => {
      message.error("Registration failed");
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() });
      message.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update profile");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      message.success("Password changed successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to change password");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      message.success("Logged out successfully");
    },
    onError: (error: Error) => {
      message.error("Logout failed");
    },
  });
};
