import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function getCourseProgress(courseId: string) {
  const user = await getCurrentUser();

  if (!user) return 0;

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id, courseId },
  });

  if (!enrollment) return 0;

  return enrollment.progressPercent;
}
