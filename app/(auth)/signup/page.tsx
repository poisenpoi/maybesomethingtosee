import Signup from "@/components/auth/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | EduTIA",
  description: "Signup to your EduTIA account",
};

export default function Page() {
  return <Signup />;
}
