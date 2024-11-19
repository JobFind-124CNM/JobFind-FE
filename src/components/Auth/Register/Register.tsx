"use client";

import React, { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Here you would typically send the form data to your backend
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
              alt="Kanban Logo"
              width={300}
              height={300}
              className="mx-auto mb-8"
            />
          </Link>
          <h1 className="text-[#0095E8] text-7xl font-bold tracking-wide"></h1>
        </div>
      </section>

      {/* Registration Section */}
      <section className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Small Logo for Mobile */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img
                src="/logo.png.webp"
                alt="Kanban Logo"
                width={150}
                height={150}
                className="mb-6"
              />
            </Link>
            <h2 className="text-[32px] font-semibold text-gray-900">
              Create an account
            </h2>
            {/* <p className="text-base text-gray-500">Start your 30-day free trial.</p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={nameId} className="text-gray-700">
                Name <span className="text-rose-500"> *</span>
              </Label>
              <Input
                id={nameId}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="h-11 border-gray-200"
                required
              />
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
                className="h-11 border-gray-200"
                required
              />
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
                className="h-11 border-gray-200"
                required
                minLength={8}
              />
              {/* <p className="text-sm text-gray-500">Must be at least 8 characters.</p> */}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#0095E8] hover:bg-[#0095E8]/90"
            >
              Sign up
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
              Sign up with Google
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
              Sign up with Facebook
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0095E8] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
