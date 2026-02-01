"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function rateCourse(
  courseId: string,
  rating: number,
  comment?: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    update: {
      rating,
      comment: comment?.trim() || null,
    },
    create: {
      userId: user.id,
      courseId,
      rating,
      comment: comment?.trim() || null,
    },
  });

  const stats = await prisma.review.aggregate({
    where: { courseId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.course.update({
    where: { id: courseId },
    data: {
      avgRating: stats._avg.rating ?? 0,
      reviewCount: stats._count.rating,
    },
  });
}
