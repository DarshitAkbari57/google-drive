"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, EyeOff, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { generatePopup } from "@/utils/toast";

const Signup = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      if (data.confirmPassword !== data.password) {
        setServerError("Passwords do not match with confirm password");
      }
      const result = await dispatch(registerUser(data));
      if (result.payload.message) {
        generatePopup("success", result.payload.message);
        router.push("/login");
      } else {
        setServerError(result.payload);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setServerError("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to get started with our platform"
      type="signup"
    >
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="name"
          type="text"
          label="Full name"
          placeholder="John Doe"
          icon={<User size={18} />}
          error={errors.name?.message}
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />

        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="your@email.com"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message:
                  "Password must include uppercase, lowercase, number and special character",
              },
            })}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <Button className="mt-2" type="submit" fullWidth isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
