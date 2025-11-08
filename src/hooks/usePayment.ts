import { useMutation } from "@tanstack/react-query";
import {
  paymentApi,
  CreateCheckoutSessionRequest,
  VerifyPaymentRequest,
} from "../services/payment";
import { message } from "antd";

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionRequest) =>
      paymentApi.createCheckoutSession(data),
    onSuccess: (response) => {
      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err?.response?.data?.message || "Failed to create payment session"
      );
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => paymentApi.verifyPayment(data),
    // Don't show error toast here - let the component handle it
  });
};

export const useRepayment = () => {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionRequest) =>
      paymentApi.createCheckoutSession(data),
    onSuccess: (response) => {
      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url;
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err?.response?.data?.message || "Failed to create repayment session"
      );
    },
  });
};
