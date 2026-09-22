export const SPECIES = {
  dog: {
    label: "Dog",
    plural: "Dogs",
    color: "text-dog",
    tint: "bg-dog-tint",
    photo: "bg-dog-photo",
  },
  cat: {
    label: "Cat",
    plural: "Cats",
    color: "text-cat",
    tint: "bg-cat-tint",
    photo: "bg-cat-photo",
  },
  bearded_dragon: {
    label: "Bearded Dragon",
    plural: "Bearded Dragons",
    color: "text-dragon",
    tint: "bg-dragon-tint",
    photo: "bg-dragon-photo",
  },
} as const;

export type Species = keyof typeof SPECIES;
