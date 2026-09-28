import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note } = await supabase
    .from("slatehour_notes")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();
  if (!note) notFound();

  const { data: author } = await supabase
    .from("slatehour_profiles")
    .select("handle, display_name")
    .eq("id", note.author_id)
    .maybeSingle();

  return (
    <section className="hero" style={{ paddingBottom: 80 }}>
      <p className="kicker">From the wall</p>
      <p className="meta">{author ? `${author.display_name} · @${author.handle}` : "Unsigned"}</p>
      <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>{note.title}</h1>
      <article className="card" style={{ marginTop: 28 }}>
        <div className="body">{note.body}</div>
      </article>
    </section>
  );
}
