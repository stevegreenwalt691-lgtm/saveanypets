import type { Metadata } from "next";
import Image from "next/image";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { getStoryPhotoUrl } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Success stories | Save Any Pets",
  description: "Real adoptions, shared with the adopter's consent.",
};

export default async function SuccessStoriesPage() {
  const supabase = await createClient();
  const { data: stories, error } = await supabase
    .from("success_stories")
    .select("id, title, body, adopter_first_name, photo_path, published_at, pets(name)")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-14">
      <h1 className="text-[34px] sm:text-[52px]">Success stories</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        Real adoptions, shared with the adopter&apos;s consent.
      </p>

      {stories && stories.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <GlassCard key={story.id} noPadding className="flex flex-col gap-4 p-6">
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[20px] bg-brand-tint">
                {story.photo_path ? (
                  <Image
                    src={getStoryPhotoUrl(story.photo_path)}
                    alt={story.pets?.name ?? story.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <Heart className="h-8 w-8 text-brand" strokeWidth={1.6} />
                )}
              </div>
              <div>
                <h2 className="text-xl">{story.pets?.name ?? story.title}</h2>
                {story.adopter_first_name ? (
                  <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
                    Adopted by {story.adopter_first_name}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-ink-2">{story.body}</p>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="mt-10 text-center">
          <p className="text-ink-2">No stories published yet. Check back soon.</p>
        </GlassCard>
      )}
    </main>
  );
}
