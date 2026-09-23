export const SPECIES = {
  dog: {
    label: "Dog",
    plural: "Dogs",
    color: "text-dog",
    tint: "bg-dog-tint",
    photo: "bg-dog-photo",
    careTeaser:
      "Exercise, training and the basics of settling a dog into a new home.",
  },
  cat: {
    label: "Cat",
    plural: "Cats",
    color: "text-cat",
    tint: "bg-cat-tint",
    photo: "bg-cat-photo",
    careTeaser:
      "Litter training, scratching posts and helping a cat feel safe in a new space.",
  },
  bearded_dragon: {
    label: "Bearded Dragon",
    plural: "Bearded Dragons",
    color: "text-dragon",
    tint: "bg-dragon-tint",
    photo: "bg-dragon-photo",
    careTeaser:
      "Tank setup, UVB lighting and a varied diet for a healthy bearded dragon.",
  },
} as const;

export type Species = keyof typeof SPECIES;

/**
 * Adoption application questions differ by species. This is the one place
 * that branches on species for the application form, everything else reads
 * this config instead of checking `pet.species` directly.
 */
export const SPECIES_APPLICATION_QUESTIONS: Record<
  Species,
  {
    currentPetsLabel: string;
    showSecureOutdoorSpace: boolean;
    showReptileExperience: boolean;
    showUvbSetup: boolean;
  }
> = {
  dog: {
    currentPetsLabel: "Do you have other pets, including other dogs? Tell us about them.",
    showSecureOutdoorSpace: true,
    showReptileExperience: false,
    showUvbSetup: false,
  },
  cat: {
    currentPetsLabel: "Do you have other pets at home? Tell us about them.",
    showSecureOutdoorSpace: false,
    showReptileExperience: false,
    showUvbSetup: false,
  },
  bearded_dragon: {
    currentPetsLabel: "Do you have other pets at home? Tell us about them.",
    showSecureOutdoorSpace: false,
    showReptileExperience: true,
    showUvbSetup: true,
  },
};
