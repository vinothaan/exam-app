import Link from "next/link";

export default function DemoPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Experience the Portal</h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.2rem' }}>
                    Take a tour of the features that will help you crack your bank exams.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/auth/login" className="btn btn-primary">
                        Sign Up to Get Started
                    </Link>
                </div>
            </div>

            {/* Feature 1: Exam Interface */}
            <section style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'hsl(var(--primary))' }}>1. Real Exam Interface</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'hsl(var(--foreground))' }}>
                            Practice in an environment that mimics the actual IBPS/SBI exam screens.
                            <br /><br />
                            ✅ <b>Timer Integration:</b> Learn time management.<br />
                            ✅ <b>Question Palette:</b> Mark for review, save & next.<br />
                            ✅ <b>Instant Submission:</b> Get results immediately.
                        </p>
                    </div>
                    <div className="card" style={{ padding: '2rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
                        {/* Mock UI */}
                        <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>IBPS PO Mock Test 1</span>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⏱️ 14:32 Left</span>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontWeight: '500', marginBottom: '1rem' }}>Q.5) A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?</p>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div style={{ padding: '0.5rem', border: '1px solid hsl(var(--secondary))', borderRadius: '4px', background: 'hsl(var(--secondary)/0.1)' }}>120 metres</div>
                                <div style={{ padding: '0.5rem', border: '1px solid hsl(var(--border))', borderRadius: '4px' }}>150 metres</div>
                                <div style={{ padding: '0.5rem', border: '1px solid hsl(var(--border))', borderRadius: '4px' }}>180 metres</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }}>Save & Next</button>
                            <button className="btn" style={{ flex: 1, border: '1px solid hsl(var(--border))' }}>Clear</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Detailed Analytics */}
            <section style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div className="card" style={{ padding: '2rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
                        {/* Mock Graph UI */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(var(--border))' }}>
                            <div style={{ flex: 1, background: 'hsl(var(--secondary))', height: '40%', borderRadius: '4px 4px 0 0', opacity: 0.5 }}></div>
                            <div style={{ flex: 1, background: 'hsl(var(--secondary))', height: '60%', borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
                            <div style={{ flex: 1, background: 'hsl(var(--primary))', height: '85%', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, background: 'hsl(var(--secondary))', height: '50%', borderRadius: '4px 4px 0 0', opacity: 0.6 }}></div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>Progress Growth 📈</div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'hsl(var(--primary))' }}>2. Smart Analytics</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'hsl(var(--foreground))' }}>
                            Don't just take tests, analyze them. We track your performance over time.
                            <br /><br />
                            📊 <b>Subject breakdown:</b> See if you are weak in Quant or English.<br />
                            📈 <b>Growth Charts:</b> Visualize your improvement.<br />
                            📝 <b>Answer Key Review:</b> Learn from every mistake with detailed solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature 3: Study Material */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'hsl(var(--primary))' }}>3. Comprehensive Library</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'hsl(var(--foreground))' }}>
                            Access high-quality PDF notes categorized for easy learning.
                            <br /><br />
                            📂 <b>Quant, Reasoning, English, CA:</b> All topics covered.<br />
                            ⬇️ <b>Downloadable:</b> Study offline anytime.<br />
                            🔍 <b>Easy Search:</b> Find exactly what you need.
                        </p>
                    </div>
                    <div className="card" style={{ padding: '2rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {['Quantitative Aptitude Tricks', 'Monthly Current Affairs Capsule', '1000 Puzzle Series PDF'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{item}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>PDF • 2.4 MB</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ textAlign: 'center', marginTop: '4rem', padding: '4rem', background: 'hsl(var(--secondary)/0.1)', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Ace Your Exam?</h2>
                <Link href="/auth/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
                    Start Your Free Trial
                </Link>
            </div>
        </div>
    );
}
