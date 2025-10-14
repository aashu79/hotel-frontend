import * as yup from "yup";

// Registration validation schema
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\s()-]{7,15}$/, "Valid phone number required"),
});

// OTP verification schema
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "Valid 6-digit OTP required"),
});

// Login validation schema
export const loginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\s()-]{7,15}$/, "Valid phone number required"),
});
