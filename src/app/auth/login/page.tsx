"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
    // We can use createActionState in newer Next.js / React versions, or verify usage.
    // Standard form for now to keep it simple and robust.

    return (
        <div className="card auth-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3>Welcome Back</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Sign in to continue your prep</p>
            </div>

            <form action={login}>
                <div className="form-group">
                    <label className="label" htmlFor="email">Email</label>
                    <input className="input" id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input className="input" id="password" name="password" type="password" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                    Sign In
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Don't have an account?{" "}
                    <Link href="/auth/register" style={{ color: 'hsl(var(--secondary))', textDecoration: 'none' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
