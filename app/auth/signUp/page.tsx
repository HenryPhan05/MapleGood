"use client";

import NavigationBarAuth from "../../components/NavigationBarAuth";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First Name is required!"),
  lastName: z.string().min(1, "Last Name is required!"),
  email: z.string().email("Invalid Email address!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character!"),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match!",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const router = useRouter();

  const onSubmit = async (data: SignUpForm) => {
    setApiError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: `${data.firstName} ${data.lastName}`
        });
      }

      router.push("/auth/signIn");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/email-already-in-use') {
        setApiError("An account with this email already exists.");
      } else {
        setApiError(err.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <NavigationBarAuth />
      </div>

      <div className="bg-white min-h-screen flex flex-col py-10">
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#E0A800" }}>
            Create an Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-8 rounded shadow-md w-full max-w-md space-y-4">

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{apiError}</span>
              </div>
            )}

            <div className="flex flex-row space-x-4">
              <div className="flex-1">
                <label className="block mb-1 text-black font-bold">First Name</label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <input
                      className={`w-full border px-3 py-2 rounded text-black ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="John"
                      value={value}
                      onChange={onChange} />
                  )} />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-black font-bold">Last Name</label>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <input
                      className={`w-full border px-3 py-2 rounded text-black ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Doe"
                      value={value}
                      onChange={onChange} />
                  )} />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-black font-bold">Email</label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <input
                    type="email"
                    className={`w-full border px-3 py-2 rounded text-black ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="JohnDoe@email.com"
                    value={value}
                    onChange={onChange} />
                )} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-black font-bold">Password</label>
              <div className="relative w-full">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full border px-3 py-2 rounded text-black ${errors.password ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Min. 8 characters"
                      value={value}
                      onChange={onChange}
                    />
                  )} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-black hover:cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-black font-bold">Confirm Password</label>
              <div className="relative w-full">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full border px-3 py-2 rounded text-black ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Confirm your password"
                      value={value}
                      onChange={onChange}
                    />
                  )} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-black hover:cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded text-black font-bold hover:opacity-70 hover:cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#E0A800" }}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-black">Already have an account? </span>
              <Link href="/auth/signIn" className="underline font-bold hover:opacity-70" style={{ color: "#E0A800" }}>
                Sign In
              </Link>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
