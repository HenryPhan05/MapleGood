"use client";
import NavigationBarAuth from "../../components/NavigationBarAuth";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("invalid Email address!"),
  password: z.string().min(8, "invalid Password!"),
});

type loginForm = z.infer<typeof loginSchema>

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState();
  const { control, handleSubmit, formState: { errors } } = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });
  const router = useRouter();

  /* CONNECT DATABASE
    const onSubmit = async (data: loginForm) => {
      setApiError(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setApiError(payload.error ?? "Sign in failed");
        return;
      }
      router.push("/user");
      router.refresh();
    };
  */

  const onSubmit = (data: loginForm) => {
    setApiError(null);
    if (data.email === process.env.NEXT_PUBLIC_USEREMAIL && data.password === process.env.NEXT_PUBLIC_USERPASSWORD) {
      router.push("/user");
    }
    else {
      setApiError("Email or Password is incorrect!");
      return;
    }
  }
  return (
    <>
      <div className="sticky top-0 z-50 bg-white ">
        <NavigationBarAuth />
      </div>
      <div className="bg-white min-h-screen flex flex-col">

        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#E0A800" }}>
            Sign In
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-8 rounded shadow-md w-full max-w-md space-y-4">

            <div>
              <label className="block mb-1 text-black font-bold ">Email</label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <input
                    required
                    className={`w-full border px-3 py-2 rounded text-black ${errors.email ? "border-red-500  " : "border-gray-500 "}`}
                    placeholder="JohnDoe@email.com"
                    value={value}
                    onChange={onChange} />
                )} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1  text-black font-bold">Password</label>
              <div className="relative w-full">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full border px-3 py-2 rounded text-black  ${errors.password ? "border-red-500  " : "border-gray-500 "}`}
                      placeholder=""
                      value={value}
                      onChange={onChange}
                    />
                  )} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-black hover:cursor-pointer"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                {apiError && (
                  <p className="text-red-600 text-sm font-medium">{apiError}</p>
                )}
              </div>

            </div>

            <div className="flex flex-row justify-between">

              <button
                type="submit"
                className=" w-50 h-10 rounded text-black font-bold hover:opacity-70 hover:cursor-pointer " style={{ backgroundColor: "#E0A800" }}
              >
                Sign In
              </button>
              <button className="underline font-bold hover:opacity-70 hover:cursor-pointer" style={{ color: "#E0A800" }}>
                Fotgot password?
              </button>
            </div>
            <button className="w-full h-10 rounded text-black font-bold border-2 hover:opacity-70 hover:cursor-pointer" style={{ borderColor: "#E0A800" }}>Create an account</button>
          </form>
        </div >
      </div >
    </>
  )
}