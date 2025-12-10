"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40,
                    display: isSidebarOpen ? 'block' : 'none',
                }}
            ></div>

            <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar />
            </div>

            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className="btn-icon mobile-only"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{ marginRight: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ☰
                        </button>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Dashboard</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
                            Hello, <strong>{session?.user?.name || 'User'}</strong>
                        </span>
                        <div className="avatar" style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'hsl(var(--secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 'bold'
                        }}>
                            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
