import Homepage from "../../components/Homepage";
import { getCurrentUser } from "@/lib/auth";
import { mapCourseToUI } from "@/lib/mappers/course";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const user = await getCurrentUser();
  const userId = user?.id;

  const topCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }, { title: "asc" }],
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      level: true,
      duration: true,
      thumbnailUrl: true,
      avgRating: true,
      reviewCount: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { userId: true },
          }
        : false,
    },
  });

  return (
    <Homepage
      topCourses={topCourses.map((course) => mapCourseToUI(course, { userId }))}
      isAuthenticated={!!user}
    />
  );
}
