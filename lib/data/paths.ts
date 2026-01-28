import { prisma } from "@/lib/prisma";
import { PathUI } from "@/types/path.ui";

export async function getPaths(): Promise<PathUI[]> {
  return await prisma.learningPath.findMany({
    where: {
      isPublished: true,
    },
    include: {
      items: {
        include: {
          course: true,
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
