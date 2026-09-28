"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeskForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Sign in first.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("slatehour_notes").insert({
      author_id: user.id,
      title: title.trim(),
      body: body.trim(),
      is_public: isPublic,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    setBody("");
    router.refresh();
  }

  return (
    <form className="sheet" onSubmit={onSubmit} style={{ marginTop: 28 }}>
      <label>
        Title
        <input required value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Note
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} />
      </label>
      <label className="check">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Mark public — hangs on the wall
      </label>
      {err && <p className="err">{err}</p>}
      <button disabled={busy}>{busy ? "Saving…" : "Keep this"}</button>
    </form>
  );
}
