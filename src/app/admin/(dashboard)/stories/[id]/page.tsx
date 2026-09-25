import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoryForm } from "@/components/admin/stories/StoryForm";
import { StoryPhotoManager } from "@/components/admin/stories/StoryPhotoManager";
import type { StoryFormValues } from "@/lib/validation/story";

export const metadata: Metadata = { title: "Edit story | Save Any Pets admin" };

export default async function EditStoryPage({ params }: PageProps<"/admin/stories/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: story, error }, { data: pets }] = await Promise.all([
    supabase.from("success_stories").select("*").eq("id", id).maybeSingle(),
    supabase.from("pets").select("id, name").order("name", { ascending: true }),
  ]);

  if (error) throw error;
  if (!story) notFound();

  const defaultValues: StoryFormValues = {
    title: story.title,
    pet_id: story.pet_id ?? "",
    adopter_first_name: story.adopter_first_name ?? "",
    body: story.body,
    consent_given: story.consent_given,
    published: story.published,
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">{story.title}</h1>
      <StoryForm mode="edit" storyId={story.id} defaultValues={defaultValues} pets={pets ?? []} />
      <StoryPhotoManager storyId={story.id} photoPath={story.photo_path} />
    </div>
  );
}
