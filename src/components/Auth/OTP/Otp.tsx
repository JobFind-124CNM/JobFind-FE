import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast, ToastContainer } from "@/utils/toastConfig";

export default function Otp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { userId, email } = location.state || {};

  const navigate = useNavigate();

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const otpValue = otp.join("");

      try {
        setLoading(true);

        const response = await api.post(`/auth/verify-otp`, {
          user_id: userId,
          otp_code: otpValue,
        });

        if (!response.data?.status) {
          toast.error("Invalid OTP. Please try again.");
          return;
        }

        showToast("OTP verified successfully.", "success");

        navigate("/login");
      } catch (err: any) {
        showToast(
          err.response?.data?.message || "Invalid OTP. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [otp, navigate]
  );

  const handleResend = useCallback(async () => {
    setResendTimer(60);

    try {
      setLoading(true);

      await api.post("/auth/resend-otp", { email: email });
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-[#3461FF] rounded-lg p-8 text-center h-[400px]">
          <div className="w-48 h-56 bg-[#FFB800] rounded-md  mx-auto flex items-center justify-center mb-4">
            <Smartphone className="w-44 h-52 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            OTP VERIFICATION
          </h2>
          <p className="text-white/90 text-md">
            Please check your registered email to get OTP code!
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
            disabled={loading}
          >
            {loading ? "Submit..." : "Submit"}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
