"use client";

import Link from "next/link";
import { register } from "../actions";
import { redirect } from "next/navigation";

export default function RegisterPage() {
    async function clientAction(formData: FormData) {
        await register(formData);
        // Needed to handle redirect on client or handle success state if server action doesn't redirect
        // But our server action currently inserts and does not redirect yet.
        // Let's assume we want to redirect to login or dashboard.
        // Ideally update server action to redirect.
        // For now, let's keep it simple.
        window.location.href = "/auth/login?registered=true";
    }

    return (
        <div className="card auth-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3>Create Account</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Start your journey today</p>
            </div>

            <form action={clientAction}>
                <div className="form-group">
                    <label className="label" htmlFor="name">Full Name</label>
                    <input className="input" id="name" name="name" type="text" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="email">Email</label>
                    <input className="input" id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input className="input" id="password" name="password" type="password" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                    Sign Up
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Already have an account?{" "}
                    <Link href="/auth/login" style={{ color: 'hsl(var(--secondary))', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
