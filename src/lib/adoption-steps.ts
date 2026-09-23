import { Search, ClipboardList, Handshake, Home, type LucideIcon } from "lucide-react";

export interface AdoptionStep {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const ADOPTION_STEPS: AdoptionStep[] = [
  {
    icon: Search,
    title: "Browse pets",
    body: "Filter by species, age or size and find a pet who fits your home.",
  },
  {
    icon: ClipboardList,
    title: "Apply online",
    body: "Tell us about your home and experience. It only takes a few minutes.",
  },
  {
    icon: Handshake,
    title: "Meet in person",
    body: "Book a meet and greet. There is no fee until after you have met your new friend.",
  },
  {
    icon: Home,
    title: "Bring them home",
    body: "Pay the adoption fee in person and take your new friend home. Local pickup only.",
  },
];
