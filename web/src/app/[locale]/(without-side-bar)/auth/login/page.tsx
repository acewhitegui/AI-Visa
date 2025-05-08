"use client"
import {LoginForm} from "@/app/components/ui/LoginForm";
import {Suspense} from "react";

export default function Login() {
  return (
    <Suspense>
      <LoginForm/>
    </Suspense>
  );
}