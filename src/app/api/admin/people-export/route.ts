import { NextResponse, type NextRequest } from "next/server";
import { requireStaff, NotStaffError } from "@/lib/actions/admin-guard";
import { buildCsv } from "@/lib/csv";
import { SPECIES } from "@/lib/species";

export async function GET(request: NextRequest) {
  let supabase;
  try {
    supabase = await requireStaff();
  } catch (error) {
    if (error instanceof NotStaffError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  const tab = request.nextUrl.searchParams.get("tab");
  let csv: string;
  let filename: string;

  if (tab === "surrender") {
    const { data, error } = await supabase
      .from("surrenders")
      .select("owner_name, email, phone, species, pet_name, pet_age, reason, handled, created_at")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: "Could not load data." }, { status: 500 });

    csv = buildCsv(
      ["Owner name", "Email", "Phone", "Species", "Pet name", "Pet age", "Reason", "Handled", "Submitted"],
      (data ?? []).map((row) => [
        row.owner_name,
        row.email ?? "",
        row.phone,
        SPECIES[row.species].label,
        row.pet_name ?? "",
        row.pet_age ?? "",
        row.reason,
        row.handled ? "Yes" : "No",
        row.created_at,
      ]),
    );
    filename = "surrenders.csv";
  } else {
    const type = tab === "volunteer" ? "volunteer" : "foster";
    const { data, error } = await supabase
      .from("people_signups")
      .select("full_name, email, phone, species_interest, message, handled, created_at")
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: "Could not load data." }, { status: 500 });

    csv = buildCsv(
      ["Full name", "Email", "Phone", "Species interest", "Message", "Handled", "Submitted"],
      (data ?? []).map((row) => [
        row.full_name,
        row.email,
        row.phone ?? "",
        row.species_interest.map((species) => SPECIES[species].label).join("; "),
        row.message ?? "",
        row.handled ? "Yes" : "No",
        row.created_at,
      ]),
    );
    filename = `${type}s.csv`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
