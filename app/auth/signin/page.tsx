"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0808]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Progress Dashboard
        </h1>
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="px-6 py-3 bg-[#ff3355] text-white rounded font-semibold hover:bg-[#ff2070]"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
