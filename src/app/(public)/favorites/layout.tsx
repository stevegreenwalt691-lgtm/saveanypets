import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your favourites | Save Any Pets",
  description: "Pets you have saved on this device.",
};

export default function FavoritesLayout({ children }: LayoutProps<"/favorites">) {
  return children;
}
