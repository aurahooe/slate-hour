import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatHourLabel, hourKey } from "@/lib/hour";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();
  const key = hourKey();

  const { data: hour } = await supabase
    .from("slatehour_hours")
    .select("hour_key, kicker, note_id")
    .eq("hour_key", key)
    .maybeSingle();

  let featured = null;
  if (hour?.note_id) {
    const { data } = await supabase
      .from("slatehour_notes")
      .select("id, title, body, created_at, author_id")
      .eq("id", hour.note_id)
      .eq("is_public", true)
      .maybeSingle();
    featured = data;
  }

  if (!featured) {
    const { data } = await supabase
      .from("slatehour_notes")
      .select("id, title, body, created_at, author_id")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(1);
    featured = data?.[0] || null;
  }

  let author = null;
  if (featured?.author_id) {
    const { data } = await supabase
      .from("slatehour_profiles")
      .select("handle, display_name")
      .eq("id", featured.author_id)
      .maybeSingle();
    author = data;
  }

  const { data: recent } = await supabase
    .from("slatehour_notes")
    .select("id, title, body, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <>
      <section className="hero">
        <p className="kicker">A room, not a feed</p>
        <h1 className="display">The hour<br />keeps one page.</h1>
        <p className="lede">
          Write something short. Mark it public and it hangs on the wall.
          Every hour the room chooses one piece and holds it under the lamp.
        </p>
        <div className="clock">
          <span className="dot" />
          {formatHourLabel(key)}
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <p className="kicker">{hour?.kicker || "This hour"}</p>
          {featured ? (
            <>
              <p className="meta">
                {author ? `${author.display_name} · @${author.handle}` : "Unsigned"}
              </p>
              <h2>{featured.title}</h2>
              <div className="body">{featured.body}</div>
            </>
          ) : (
            <>
              <h2>The slate is still empty.</h2>
              <p className="body">Be the first to leave a public note.</p>
              <p style={{ marginTop: 20 }}>
                <Link className="btn" href="/enter">Enter the room</Link>
              </p>
            </>
          )}
        </article>

        <aside className="stack">
          <p className="kicker">On the wall</p>
          {(recent || []).map((n) => (
            <Link key={n.id} href={`/n/${n.id}`} className="slip">
              <h3>{n.title}</h3>
              <p>{n.body.slice(0, 110)}{n.body.length > 110 ? "…" : ""}</p>
            </Link>
          ))}
          <Link href="/wall" className="btn" style={{ marginTop: 8 }}>See the wall</Link>
        </aside>
      </section>
    </>
  );
}
