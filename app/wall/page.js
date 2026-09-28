import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 30;

export default async function Wall() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("slatehour_notes")
    .select("id, title, body, created_at, author_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(40);

  const ids = [...new Set((notes || []).map((n) => n.author_id))];
  const { data: profiles } = ids.length
    ? await supabase.from("slatehour_profiles").select("id, handle, display_name").in("id", ids)
    : { data: [] };
  const map = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

  return (
    <section className="hero" style={{ paddingBottom: 64 }}>
      <p className="kicker">Public only</p>
      <h1 className="display">The wall.</h1>
      <p className="lede">Anything marked public lives here. Private notes stay at your desk.</p>
      <div className="stack" style={{ marginTop: 36 }}>
        {(notes || []).map((n) => {
          const a = map[n.author_id];
          return (
            <Link key={n.id} href={`/n/${n.id}`} className="slip">
              <p className="meta">{a ? `${a.display_name} · @${a.handle}` : "Unsigned"}</p>
              <h3>{n.title}</h3>
              <p>{n.body.slice(0, 180)}{n.body.length > 180 ? "…" : ""}</p>
            </Link>
          );
        })}
        {(!notes || notes.length === 0) && <p>Nothing public yet.</p>}
      </div>
    </section>
  );
}
