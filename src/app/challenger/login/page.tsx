"use client";

import * as React from "react";
import { LoginForm } from "@/src/components/login/LoginForm";
import { Logo } from "@/src/components/custom/Logo";

const Login = () => {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Logo />
            Challenger
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
