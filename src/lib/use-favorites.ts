"use client";

import { useSyncExternalStore } from "react";
import { FAVORITES_CHANGED_EVENT, getFavoriteIds } from "@/lib/favorites";

function subscribe(callback: () => void) {
  window.addEventListener(FAVORITES_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_FAVORITES: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY_FAVORITES;
}

export function useFavoriteIds(): string[] {
  return useSyncExternalStore(subscribe, getFavoriteIds, getServerSnapshot);
}

export function useIsFavorite(petId: string): boolean {
  return useFavoriteIds().includes(petId);
}
