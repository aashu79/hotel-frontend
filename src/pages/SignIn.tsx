import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, otpSchema } from "../lib/validations/auth";
import useAuthStore from "../store/authStore";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface LoginFormData {
  phoneNumber: string;
}

interface OtpFormData {
  otp: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    sendLoginOtp,
    verifyLoginOtp,
    isLoading,
    error: storeError,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts or step changes
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [step, clearError]);

  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChangeVerificationCode = (index: number, value: string) => {
    if (value.length > 1) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    const completeOtp = [...newVerificationCode].join("");
    otpForm.setValue("otp", completeOtp);

    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (/^\d+$/.test(pasteData) && pasteData.length <= 6) {
      const digits = pasteData.split("");
      const newVerificationCode = [...verificationCode];

      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newVerificationCode[i] = digits[i];
      }

      setVerificationCode(newVerificationCode);

      const completeOtp = newVerificationCode.join("");
      otpForm.setValue("otp", completeOtp);

      if (digits.length < 6) {
        const nextInput = document.getElementById(`code-${digits.length}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    clearError();
    setSuccessMessage("");

    try {
      const success = await sendLoginOtp(data.phoneNumber);

      if (success) {
        setTempPhoneNumber(data.phoneNumber);
        setSuccessMessage("OTP sent successfully! Check your phone.");
        setTimeout(() => {
          clearError(); // Clear any errors before changing step
          setStep(2);
        }, 500);
      }
    } catch (error) {
      // Error handled by storeError
    }
  };

  const onSubmitVerification = async (data: OtpFormData) => {
    clearError();
    setSuccessMessage("");

    try {
      const success = await verifyLoginOtp(tempPhoneNumber, data.otp);

      if (success) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      // Error handled by storeError
    }
  };

  const resendOTP = async () => {
    if (tempPhoneNumber) {
      clearError();
      setSuccessMessage("");
      await sendLoginOtp(tempPhoneNumber);
      setSuccessMessage("OTP resent! Check your phone.");
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: step === 1 ? -40 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: {
      opacity: 0,
      x: step === 1 ? 40 : -40,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute top-0 -right-10 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-0 -left-10 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-50"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 pt-14 md:pt-16 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="overflow-hidden bg-gradient-to-b from-zinc-900/95 to-black backdrop-blur-lg border border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/40"
          >
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>

            <div className="p-6 sm:p-8">
              {/* Form Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-center mb-7"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg border border-zinc-700/60"
                >
                  <div className="w-9 h-9 bg-gradient-to-r from-red-500/90 to-red-600 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-4 text-2xl font-bold text-white"
                >
                  {step === 1 ? "Sign In" : "Verify Your Identity"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-1.5 text-sm text-zinc-400 font-medium"
                >
                  {step === 1
                    ? "Welcome back to Himalayan Restro"
                    : `Enter the verification code sent to ${tempPhoneNumber}`}
                </motion.p>
              </motion.div>

              {/* Alerts */}
              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-3 rounded-lg bg-green-900/20 border border-green-500/40 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-100 text-sm font-medium">
                      {successMessage}
                    </p>
                  </motion.div>
                )}

                {storeError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-3 rounded-lg bg-red-900/20 border border-red-500/40 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-200 text-sm font-medium">
                        Authentication Failed
                      </p>
                      <p className="text-red-300/90 text-xs mt-1">
                        {storeError}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="login"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form
                      onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                      className="space-y-5"
                    >
                      <div className="space-y-2.5">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-zinc-300"
                        >
                          Phone Number
                        </label>
                        <div className="relative enhanced-phone-input-wrapper">
                          <Controller
                            control={loginForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <PhoneInput
                                international
                                defaultCountry="IN"
                                value={field.value}
                                onChange={field.onChange}
                                className="enhanced-phone-input"
                              />
                            )}
                          />
                          <div className="phone-input-highlight"></div>
                        </div>
                        {loginForm.formState.errors.phoneNumber && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5"
                          >
                            <AlertCircle size={14} className="flex-shrink-0" />
                            <span>
                              {loginForm.formState.errors.phoneNumber.message}
                            </span>
                          </motion.p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-2.5 mt-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            Continue <ArrowRight className="ml-2" size={18} />
                          </>
                        )}
                      </Button>

                      {/* Footer Links */}
                      <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-400">
                          Don't have an account?{" "}
                          <Link
                            to="/signup"
                            className="font-medium text-red-400 hover:text-red-300 transition-colors"
                          >
                            Sign up
                          </Link>
                        </p>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="verification"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form
                      onSubmit={otpForm.handleSubmit(onSubmitVerification)}
                      className="space-y-5"
                    >
                      <div className="space-y-3">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-zinc-300"
                        >
                          Verification Code
                        </label>

                        {/* Enhanced OTP Input */}
                        <div className="grid grid-cols-6 gap-2 sm:gap-3">
                          {verificationCode.map((digit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 + 0.1 }}
                              className="relative"
                            >
                              <input
                                id={`code-${index}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="\d{1}"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleChangeVerificationCode(
                                    index,
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-full h-14 text-center text-xl font-bold rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-white focus:border-red-500/70 focus:ring-1 focus:ring-red-500/50 focus:outline-none transition-all duration-200"
                              />
                              {digit && (
                                <motion.div
                                  layoutId={`digit-${index}`}
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                  <div className="w-full h-0.5 bg-red-500/40 rounded absolute bottom-3"></div>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {otpForm.formState.errors.otp && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-400 text-center flex items-center justify-center gap-1.5 mt-1"
                          >
                            <AlertCircle size={14} className="flex-shrink-0" />
                            <span>{otpForm.formState.errors.otp.message}</span>
                          </motion.p>
                        )}

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-center text-sm text-zinc-400 pt-2"
                        >
                          Didn't receive the code?{" "}
                          <button
                            type="button"
                            onClick={resendOTP}
                            className="text-red-400 hover:text-red-300 font-semibold transition-colors focus:outline-none focus:underline"
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        </motion.p>
                      </div>

                      <div className="space-y-3 pt-1">
                        <Button
                          type="submit"
                          disabled={
                            isLoading ||
                            verificationCode.some((digit) => !digit)
                          }
                          className="w-full flex items-center justify-center py-2.5 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Sign In <Check className="ml-2" size={18} />
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            clearError();
                            setSuccessMessage("");
                            setVerificationCode(["", "", "", "", "", ""]);
                          }}
                          className="w-full py-2.5 border border-zinc-800 text-base font-medium rounded-xl text-zinc-300 bg-zinc-900/70 hover:bg-zinc-800/70 flex items-center justify-center gap-2 transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Back to login
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Decorative Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-zinc-600 flex items-center justify-center gap-1.5"
          >
            <Globe size={12} strokeWidth={1.5} />
            <span>Himalayan Restro • Premium Food Delivery</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced phone input styling */}
      <style jsx global>{`
        /* Enhanced Phone Input */
        .enhanced-phone-input-wrapper {
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 200ms;
        }

        .enhanced-phone-input-wrapper:focus-within .phone-input-highlight {
          opacity: 1;
        }

        .phone-input-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(to right, #ef4444, #dc2626);
          opacity: 0;
          transition: opacity 200ms;
        }

        /* Phone Input Main Styling */
        .enhanced-phone-input .PhoneInput {
          display: flex;
          align-items: center;
          background: rgba(39, 39, 42, 0.5);
          border: 1px solid rgba(82, 82, 91, 0.5);
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 200ms;
        }

        .enhanced-phone-input:focus-within .PhoneInput {
          background: rgba(39, 39, 42, 0.7);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .phone-input-error .PhoneInput {
          border-color: rgba(239, 68, 68, 0.6);
          background: rgba(127, 29, 29, 0.2);
        }

        /* Country Selection Area */
        .enhanced-phone-input .PhoneInputCountry {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          margin-right: 0.5rem;
          background: rgba(39, 39, 42, 0.6);
          border-right: 1px solid rgba(82, 82, 91, 0.5);
          transition: background 200ms;
        }

        .enhanced-phone-input:focus-within .PhoneInputCountry {
          background: rgba(64, 64, 70, 0.6);
        }

        .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          opacity: 0;
          cursor: pointer;
        }

        .PhoneInputCountrySelect:focus + .PhoneInputCountryIcon {
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
          transform: scale(1.05);
        }

        /* Country Flag */
        .PhoneInputCountryIcon {
          width: 2rem;
          height: auto;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 150ms, box-shadow 150ms;
        }

        .PhoneInputCountryIconImg {
          display: block;
          width: 100%;
          height: auto;
        }

        /* Arrow for country dropdown */
        .PhoneInputCountrySelectArrow {
          margin-left: 0.5rem;
          width: 0.6em;
          height: 0.3em;
          border-style: solid;
          border-width: 0.3em 0.3em 0 0.3em;
          border-color: rgba(180, 180, 180, 0.8) transparent transparent
            transparent;
          transition: border-color 200ms;
        }

        .enhanced-phone-input:focus-within .PhoneInputCountrySelectArrow {
          border-top-color: rgba(239, 68, 68, 0.8);
        }

        /* Phone Number Input */
        .PhoneInputInput {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          padding: 0.875rem 0.75rem;
          outline: none;
          box-shadow: none;
          transition: color 200ms;
        }

        .PhoneInputInput:focus {
          outline: none;
          box-shadow: none;
          color: white;
        }

        .PhoneInputInput::placeholder {
          color: rgba(161, 161, 170, 0.8);
        }

        /* Fix toast styling */
        div[role="status"][data-sonner-toast] {
          background-color: #18181b !important;
          border: 1px solid #3f3f46 !important;
          color: white !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3),
            0 8px 10px -6px rgb(0 0 0 / 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
