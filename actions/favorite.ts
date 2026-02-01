"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function toggleFavorite(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    return { favorited: false };
  }

  await prisma.favorite.create({
    data: {
      userId: user.id,
      courseId,
    },
  });

  return { favorited: true };
}
