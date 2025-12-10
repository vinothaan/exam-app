import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Link href="/" style={{ marginBottom: '2rem', textDecoration: 'none' }}>
                <h2 className="text-gradient">BankPrep</h2>
            </Link>
            {children}
        </div>
    );
}
