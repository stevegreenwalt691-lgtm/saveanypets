import type { Metadata } from "next";
import { GuideForm } from "@/components/admin/guides/GuideForm";
import { GUIDE_DEFAULT_VALUES } from "@/lib/validation/guide";

export const metadata: Metadata = { title: "New guide | Save Any Pets admin" };

export default function NewGuidePage() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">New guide</h1>
      <GuideForm mode="create" defaultValues={GUIDE_DEFAULT_VALUES} />
    </div>
  );
}
