import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeskForm from "./desk-form";
import Link from "next/link";

export default async function Desk() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/enter");

  const { data: profile } = await supabase
    .from("slatehour_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: notes } = await supabase
    .from("slatehour_notes")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="hero" style={{ paddingBottom: 80 }}>
      <p className="kicker">Your desk</p>
      <h1 className="display" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
        {profile?.display_name || "Writer"}.
      </h1>
      <p className="lede">Draft in private. Tick public when it is ready for the wall.</p>
      <DeskForm />
      <div className="stack" style={{ marginTop: 48 }}>
        <p className="kicker">Kept here</p>
        {(notes || []).map((n) => (
          <div key={n.id} className="slip">
            <p className="meta">{n.is_public ? "Public" : "Private"}</p>
            <h3>
              {n.is_public ? <Link href={`/n/${n.id}`}>{n.title}</Link> : n.title}
            </h3>
            <p>{n.body.slice(0, 140)}{n.body.length > 140 ? "…" : ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
