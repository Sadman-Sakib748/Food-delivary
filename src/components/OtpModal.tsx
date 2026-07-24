"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";

interface OtpModalProps {
    email: string;
    onClose: () => void;
}

export default function OtpModal({ email, onClose }: OtpModalProps) {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendDisabled]);

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to previous input on backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        // Check if pasted data is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setOtp(digits);
            // Focus on last input
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            toast.error("Please enter the complete 6-digit verification code");
            return;
        }

        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: email,
                password: "dummy",
                otp: code,
                skipOtp: true,
            });

            if (res?.ok || res?.url) {
                toast.success("OTP verified successfully! Logging you in...");
                onClose();
                // Use window.location for full page refresh
                window.location.href = "/";
            } else {
                toast.error(res?.error || "The verification code you entered is incorrect. Please try again.");
                // Clear OTP on error
                setOtp(new Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendDisabled(true);
        setTimer(30);

        try {
            const res = await fetch("/api/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend OTP");
            }

            toast.success("A new verification code has been sent to your email.");
            // Clear previous OTP
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            console.error("Resend OTP error:", err);
            toast.error(err.message || "Failed to resend OTP. Please try again.");
            setResendDisabled(false);
        } finally {
            setResendLoading(false);
        }
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative mx-4 border border-orange-100 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <AiOutlineClose size={22} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Verify Your Account
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Enter the 6-digit verification code sent to
                </p>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-6">
                    {email}
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={digit}
                            maxLength={1}
                            ref={(el) => {
                                inputRefs.current[idx] = el;
                            }}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            onPaste={idx === 0 ? handlePaste : undefined}
                            className="w-12 h-12 sm:w-14 sm:h-14 text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl text-xl font-semibold dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:opacity-50"
                            disabled={loading}
                            autoFocus={idx === 0}
                            aria-label={`OTP digit ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading || otp.join("").length !== 6}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-orange-500/30"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        "Verify OTP"
                    )}
                </button>

                {/* Resend OTP */}
                <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>Didn't receive the code?</span>
                    <button
                        onClick={!resendDisabled && !resendLoading ? handleResend : undefined}
                        disabled={resendDisabled || resendLoading}
                        className={`font-semibold transition-colors ${
                            resendDisabled || resendLoading
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                    >
                        {resendLoading ? (
                            <span className="flex items-center gap-1">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            "Resend OTP"
                        )}
                    </button>
                    {resendDisabled && !resendLoading && (
                        <span className="text-gray-400">({timer}s)</span>
                    )}
                </div>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                    For security purposes, this code will expire in 5 minutes.
                </p>
            </div>
        </div>
    );
}