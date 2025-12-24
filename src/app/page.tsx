import Link from "next/link";
import { incrementVisitorCount, getVisitorCount } from "./actions";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await incrementVisitorCount();
  const visitors = await getVisitorCount();

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <main style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Master Your Exams with Tryvo
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'hsl(var(--muted-foreground))', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Industry-standard preparation portal with real-time analytics,
          comprehensive question banks, and offline study support.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(var(--secondary)/0.1)', color: 'hsl(var(--secondary))', padding: '0.5rem 1rem', borderRadius: '30px', marginBottom: '2.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
          👀 {visitors.toLocaleString()} Learning Enthusiasts Visited
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/auth/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Get Started
          </Link>
          <Link href="/demo" className="btn" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))', padding: '0.75rem 2rem', fontSize: '1rem' }}>
            View Demo
          </Link>
        </div>
      </main>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <div style={{ width: '40px', height: '40px', background: 'hsl(var(--secondary)/0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'hsl(var(--secondary))' }}>
            📚
          </div>
          <h3>Study Materials</h3>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Access a vast library of PDFs and study resources, available offline.</p>
        </div>

        <div className="card">
          <div style={{ width: '40px', height: '40px', background: 'hsl(var(--secondary)/0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'hsl(var(--secondary))' }}>
            ⚡
          </div>
          <h3>Mock Exams</h3>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Take timed mock exams with real questions and get instant feedback.</p>
        </div>

        <div className="card">
          <div style={{ width: '40px', height: '40px', background: 'hsl(var(--secondary)/0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'hsl(var(--secondary))' }}>
            📊
          </div>
          <h3>Performance Analytics</h3>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Track your progress with detailed charts and industry-standard metrics.</p>
        </div>
      </div>
    </div>
  );
}
