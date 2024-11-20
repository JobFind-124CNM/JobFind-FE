"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone } from "lucide-react";

export default function Otp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = useCallback(
    (element: HTMLInputElement, index: number) => {
      const value = element.value;
      if (isNaN(Number(value))) return;

      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });

      // Move to next input if value is entered
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (
        e.key === "Backspace" &&
        !otp[index] &&
        index > 0 &&
        inputRefs.current[index - 1]
      ) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleResend = useCallback(() => {
    setResendTimer(30);
    // Add your resend OTP logic here
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const otpValue = otp.join("");
      console.log("Submitted OTP:", otpValue);
      // Add your verification logic here
    },
    [otp]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-[#3461FF] rounded-lg p-8 text-center h-[400px]">
          <div className="w-48 h-56 bg-[#FFB800] rounded-md  mx-auto flex items-center justify-center mb-4">
            <Smartphone className="w-44 h-52 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">XÁC THỰC OTP</h2>
          <p className="text-white/90 text-sm">
            mã đã được gửi tới sdt 0762216048
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex gap-2 justify-center">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300 rounded"
                  required
                />
              ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-[#3461FF] text-sm hover:underline disabled:text-gray-400"
            >
              bạn không nhận được Otp?{" "}
              {resendTimer > 0 ? `Gửi lại sau ${resendTimer}s` : "Gửi lại"}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3461FF] hover:bg-[#3461FF]/90 text-white py-3 rounded-lg"
          >
            Xác Thực
          </Button>
        </form>
      </div>
    </div>
  );
}
