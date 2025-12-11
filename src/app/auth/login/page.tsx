"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
    // using useActionState for form handling (Next.js 15 / React 19)
    const [state, formAction, isPending] = useActionState(login, undefined);

    return (
        <div className="card auth-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3>Welcome Back</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Sign in to continue your prep</p>
                {state?.error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'hsl(0 84.2% 60.2% / 0.1)',
                        color: 'hsl(0 84.2% 60.2%)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem'
                    }}>
                        {state.error}
                    </div>
                )}
            </div>

            <form action={formAction}>
                <div className="form-group">
                    <label className="label" htmlFor="email">Email</label>
                    <input className="input" id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input className="input" id="password" name="password" type="password" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={isPending}>
                    {isPending ? 'Signing In...' : 'Sign In'}
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
