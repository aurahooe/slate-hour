import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Slate Hour",
  description: "A reading room that turns over every hour.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="top">
            <Link className="mark" href="/">Slate <span>Hour</span></Link>
            <nav className="topnav">
              <Link href="/wall">Wall</Link>
              {user ? (
                <>
                  <Link href="/desk">Desk</Link>
                  <form action="/auth/signout" method="post">
                    <button type="submit" style={{ background: "none", color: "inherit", padding: 0, letterSpacing: "normal", textTransform: "none", font: "inherit" }}>
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/enter">Enter</Link>
              )}
            </nav>
          </header>
          {children}
          <footer>
            <span>Kept on the slate. Public notes stay public.</span>
            <span>Turns every hour.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
