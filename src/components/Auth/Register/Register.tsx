import React, { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { ToastContainer, showToast } from "@/utils/toastConfig";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const password_confirmationId = useId();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.username) {
      isValid = false;
      newErrors.username = "Username is required.";
    }

    if (!formData.email) {
      isValid = false;
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      isValid = false;
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      isValid = false;
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.password_confirmation) {
      isValid = false;
      newErrors.password_confirmation = "Passwords do not match.";
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      showToast("Registration successful!", "success");

      navigate("/verify", {
        state: {
          userId: response.data.user_id,
          email: formData.email,
        },
      });
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleRegister();
    },
    [handleRegister]
  );

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Logo Section */}
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

      {/* Registration Section */}
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
              Create an account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={usernameId} className="text-gray-700">
                Username <span className="text-rose-500"> *</span>
              </Label>
              <Input
                id={usernameId}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`h-11 border ${
                  errors.username ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={emailId} className="text-gray-700">
                Email <span className="text-rose-500"> *</span>
              </Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`h-11 border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={passwordId} className="text-gray-700">
                Password <span className="text-rose-500"> *</span>
              </Label>
              <Input
                id={passwordId}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`h-11 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={password_confirmationId}
                className="text-gray-700"
              >
                Confirm Password <span className="text-rose-500"> *</span>
              </Label>
              <Input
                id={password_confirmationId}
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={`h-11 border ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#0095E8] hover:bg-[#0095E8]/90"
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign up"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#0095E8] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
