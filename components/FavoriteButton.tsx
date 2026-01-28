"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  courseId: string;
  isFavorite: boolean;
  isAuthenticated: boolean;
  className?: string;
}

export function FavoriteButton({
  courseId,
  isFavorite,
  isAuthenticated,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(isFavorite);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const prev = optimistic;
    setOptimistic(!prev);

    startTransition(async () => {
      try {
        const res = await toggleFavorite(courseId);
        setOptimistic(res.favorited);
      } catch {
        setOptimistic(prev);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`${className ?? "absolute top-4 right-4 z-40"}`}
      aria-label="Toggle favorite"
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          optimistic
            ? "text-red-500 fill-red-500 bg-red-50 p-1 rounded-full scale-110"
            : "text-gray-800 hover:text-red-400 hover:bg-gray-100 p-1 rounded-full"
        }`}
      />
    </button>
  );
}
