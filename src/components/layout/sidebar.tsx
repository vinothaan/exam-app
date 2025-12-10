"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // Use react import for client side

const navItems = [
    { label: "Overview", href: "/dashboard", icon: "📊" },
    { label: "Leaderboard", href: "/dashboard/leaderboard", icon: "🏆" },
    { label: "Exams", href: "/dashboard/exams", icon: "📝" },
    { label: "Study Materials", href: "/dashboard/study", icon: "📚" },
    { label: "Profile", href: "/dashboard/profile", icon: "👤" },
];

import { useSession } from "next-auth/react";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>BankPrep</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <Link
                        href="/dashboard/admin"
                        className={`nav-item ${pathname === '/dashboard/admin' ? "active" : ""}`}
                        style={{ color: 'hsl(var(--secondary))' }}
                    >
                        <span className="nav-icon">🛡️</span>
                        Admin Panel
                    </Link>
                )}
            </nav>

            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="nav-item"
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="nav-icon">🚪</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
