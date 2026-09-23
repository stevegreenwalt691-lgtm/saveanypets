"use client";

import { useState } from "react";
import { TagInput } from "@/components/ui/TagInput";

export function TagInputDemo() {
  const [tags, setTags] = useState(["playful", "loyal"]);
  return <TagInput label="Personality" value={tags} onChange={setTags} />;
}
