import type { Metadata } from "next";
import { Mail, CalendarCheck, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PUBLIC_PET_STATUSES } from "@/lib/pets";

export const metadata: Metadata = { title: "Application received | Save Any Pets" };

export default async function ApplySuccessPage({ params }: PageProps<"/adopt/[slug]/apply/success">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("name")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  const petName = pet?.name ?? "your new friend";

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-16 sm:px-14">
      <GlassCard strong className="text-center">
        <h1 className="text-[34px] sm:text-[40px]">Application received</h1>
        <p className="mt-3 text-lg text-ink-2">
          Thank you for applying to adopt {petName}. We have sent a confirmation to your email.
        </p>

        <div className="mt-8 flex flex-col gap-4 text-left">
          <div className="flex items-start gap-3 rounded-[16px] bg-white/65 p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <p className="text-sm text-ink-2">
              Our team will review your application and reply within <strong>[X] days</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-[16px] bg-white/65 p-4">
            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <p className="text-sm text-ink-2">
              If your application looks like a good fit, we will confirm your meet and greet time
              by email or phone.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-[16px] bg-white/65 p-4">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <p className="text-sm text-ink-2">
              No payment is taken until after you meet in person. Questions in the meantime? Reach
              out through our contact page.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/adopt">Browse more pets</Button>
          <Button href="/" variant="outline">
            Back home
          </Button>
        </div>
      </GlassCard>
    </main>
  );
}
