// components/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "mayomikun" && password === "mayo1234") {
      localStorage.setItem("mocktopia_admin_logged_in", "true");
      router.push("/admin");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Username
        </label>
        <input 
          value={username} onChange={e => setUsername(e.target.value)} 
          type="text" placeholder="Enter username" 
          className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3.5 text-[14px] text-[#2C1A1D] outline-none transition-colors focus:border-[#2C1A1D]" 
          required
        />
      </div>
      
      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#2C1A1D]/60" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Password
        </label>
        <input 
          value={password} onChange={e => setPassword(e.target.value)} 
          type="password" placeholder="Enter password" 
          className="w-full rounded-md border border-[#2C1A1D]/20 bg-[#FBF9F5] px-4 py-3.5 text-[14px] text-[#2C1A1D] outline-none transition-colors focus:border-[#2C1A1D]" 
          required
        />
      </div>

      {error && <p className="text-[12px] text-red-600 font-medium text-center">{error}</p>}

      <button 
        type="submit" 
        className="mt-2 w-full rounded-md bg-[#2C1A1D] py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all hover:bg-[#1F1315]"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        Sign In
      </button>
    </form>
  );
}