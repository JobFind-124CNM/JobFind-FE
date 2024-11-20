"use client";

import React, { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const emailId = useId();
  const passwordId = useId();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
    },
    [formData]
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

      {/* Login Section */}
      <section className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Small Logo for Mobile */}
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
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="h-11 border-gray-200"
                required
              />
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
                className="h-11 border-gray-200"
                required
              />
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
            >
              Sign in
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
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
              <Link to="/register" className="text-[#0095E8] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
