import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hourKey, pickKicker } from "@/lib/hour";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);
  const hk = hourKey();

  const { data: existing } = await supabase
    .from("slatehour_hours")
    .select("hour_key")
    .eq("hour_key", hk)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, hour: hk, already: true });
  }

  const { data: notes } = await supabase
    .from("slatehour_notes")
    .select("id")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(24);

  const pick = notes?.length ? notes[Math.floor(Math.random() * notes.length)] : null;

  const { error } = await supabase.from("slatehour_hours").insert({
    hour_key: hk,
    note_id: pick?.id || null,
    kicker: pickKicker(hk),
  });

  if (error && !String(error.message).includes("duplicate")) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, hour: hk, note: pick?.id || null });
}
