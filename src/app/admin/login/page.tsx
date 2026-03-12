"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

function Toast({
  message,
  variant,
  onClose,
}: {
  message: string;
  variant: "error" | "success";
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-lg">
      <div
        className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          variant === "error"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
        role="status"
      >
        <div className="font-semibold">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "error" | "success" } | null>(
    null
  );

  const handleLogin = async () => {
    setToast(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setToast({ message: "Đăng nhập thành công.", variant: "success" });
      router.push("/admin/san-pham");
    } catch (e: any) {
      setToast({
        message: e?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-7">
        <h1 className="text-2xl font-bold text-slate-900">Admin đăng nhập</h1>
        <p className="text-sm text-slate-600 mt-1">
          Đăng nhập để quản lý sản phẩm.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400"
              placeholder="••••••••"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password}
            className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              loading || !email.trim() || !password
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}

