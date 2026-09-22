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
