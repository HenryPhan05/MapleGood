import { redirect } from "next/navigation";
export default function Navigate() {
  redirect("/auth/signIn");
}