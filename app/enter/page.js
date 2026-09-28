"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Enter() {
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const supabase = createClient();
    const fn = mode === "in" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/desk");
    router.refresh();
  }

  return (
    <section className="hero" style={{ paddingBottom: 80 }}>
      <p className="kicker">{mode === "in" ? "Welcome back" : "Take a seat"}</p>
      <h1 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
        {mode === "in" ? "Sign in." : "Make a desk."}
      </h1>
      <form className="sheet" onSubmit={onSubmit} style={{ marginTop: 28 }}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && <p className="err">{err}</p>}
        <button disabled={busy}>{busy ? "Working…" : mode === "in" ? "Enter" : "Create desk"}</button>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          style={{ background: "none", color: "var(--mute)", padding: 0 }}
        >
          {mode === "in" ? "Need a desk? Create one." : "Already here? Sign in."}
        </button>
      </form>
    </section>
  );
}
