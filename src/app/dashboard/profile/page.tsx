import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function ProfilePage() {
    const session = await auth();

    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'hsl(var(--secondary))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginRight: '1.5rem'
                    }}>
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0 }}>{session?.user?.name}</h3>
                        <p style={{ color: 'hsl(var(--muted-foreground))' }}>{session?.user?.email}</p>
                        <span style={{
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            background: 'hsl(var(--muted))',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            textTransform: 'capitalize'
                        }}>
                            {session?.user?.role || 'User'}
                        </span>
                    </div>
                </div>

                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <button className="btn" style={{ width: '100%', border: '1px solid hsl(var(--destructive))', color: 'hsl(var(--destructive))' }}>
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
