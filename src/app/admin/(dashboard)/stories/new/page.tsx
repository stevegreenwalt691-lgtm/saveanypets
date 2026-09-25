import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StoryForm } from "@/components/admin/stories/StoryForm";
import { STORY_DEFAULT_VALUES } from "@/lib/validation/story";

export const metadata: Metadata = { title: "New story | Save Any Pets admin" };

export default async function NewStoryPage() {
  const supabase = await createClient();
  const { data: pets } = await supabase.from("pets").select("id, name").order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">New story</h1>
      <StoryForm mode="create" defaultValues={STORY_DEFAULT_VALUES} pets={pets ?? []} />
    </div>
  );
}
