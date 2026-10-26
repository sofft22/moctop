// app/admin/login/page.tsx
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF9F5] px-6">
      <div className="w-full max-w-md rounded-lg border border-[#2C1A1D]/10 bg-white p-8 shadow-sm">
        
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-normal text-[#2C1A1D]" style={{ fontFamily: "var(--font-dm-serif), serif" }}>
            Mocktopia
          </h1>
          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#2C1A1D]/50" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Admin Portal
          </p>
        </div>

        <AdminLoginForm />

      </div>
    </div>
  );
}