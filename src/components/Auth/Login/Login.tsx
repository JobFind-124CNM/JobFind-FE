import React, { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, showToast } from "@/utils/toastConfig";
import api from "@/utils/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const emailId = useId();
  const passwordId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }));
  }, []);

  const handleSocialLogin = async (loginType: "google" | "facebook") => {
    try {
      setLoading(true);
      const response = await api.get("/auth/social", {
        params: { login_type: loginType },
      });

      const socialLoginUrl = response.data.data.url;

      if (socialLoginUrl) {
        window.location.href = socialLoginUrl;
      }
    } catch (error) {
      setLoading(false);
      showToast(`Failed to initiate ${loginType} login.`, "error");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        showToast("Login successful!", "success");

        const from = location.state?.from?.pathname || "/";

        navigate(from, { replace: true });
      } else if (response.status === 404) {
        showToast(response.data.message, "error");
      }
    } catch (err: any) {
      setErrors(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleLogin();
    },
    [handleLogin]
  );

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-[400px] text-center">
          <Link to="/">
            <img
              src="/logo.png.webp"
              alt="Jobfind Logo"
              width={300}
              height={300}
              className="mx-auto mb-8"
            />
          </Link>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img
                src="/logo.png.webp"
                alt="Jobfind Logo"
                width={150}
                height={150}
                className="mb-6"
              />
            </Link>
            <h2 className="text-[32px] font-semibold text-gray-900">
              Log in to your account
            </h2>
            <p className="text-base text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={emailId} className="text-gray-700">
                Email
              </Label>
              <Input
                id={emailId}
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`h-11 border-gray-200 ${
                  errors.email && "border-red-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={passwordId} className="text-gray-700">
                Password
              </Label>
              <Input
                id={passwordId}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`h-11 border-gray-200 ${
                  errors.password && "border-red-500"
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={handleCheckboxChange}
                  className="border-gray-200 rounded"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember for 30 days
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#0095E8] hover:underline"
              >
                Forgot password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#0095E8] hover:bg-[#0095E8]/90"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => handleSocialLogin("google")}
            >
              <img
                src="/public/icon_gg.png.webp"
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => handleSocialLogin("facebook")}
            >
              <img
                src="/public/icon_fb.png.webp"
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Facebook
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-[#0095E8] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
