"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/client";

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span>{label}</span>
      {active && <span className="text-xs opacity-90">●</span>}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingSession, setCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let ignore = false;

    async function check() {
      setCheckingSession(true);
      const { data, error } = await supabase.auth.getSession();
      if (ignore) return;

      if (error) {
        setUserEmail(null);
        if (!isLoginPage) router.push("/admin/login");
        setCheckingSession(false);
        return;
      }

      const session = data.session;
      setUserEmail(session?.user?.email ?? null);

      if (!session && !isLoginPage) {
        router.push("/admin/login");
      }

      setCheckingSession(false);
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, [router, isLoginPage, pathname]);

  const nav = useMemo(() => {
    const items = [
      { href: "/admin/san-pham", label: "Quản lý sản phẩm" },
      { href: "/admin/them-san-pham", label: "Thêm sản phẩm" },
    ];
    return (
      <nav className="space-y-2">
        {items.map((i) => (
          <NavItem
            key={i.href}
            href={i.href}
            label={i.label}
            active={pathname === i.href}
          />
        ))}
      </nav>
    );
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
            Đang kiểm tra đăng nhập...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 h-fit lg:sticky lg:top-6">
            <div className="px-2 py-2">
              <p className="text-sm font-bold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {userEmail ? userEmail : "Chưa xác định user"}
              </p>
            </div>

            <div className="mt-3">{nav}</div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-slate-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

