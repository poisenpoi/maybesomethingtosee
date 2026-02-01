import { CourseLevel } from "@prisma/client";
import { CourseUI } from "@/types/course.ui";

type MapCourseContext = {
  userId?: string;
};

export function mapCourseToUI(
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: CourseLevel;
    duration: number;
    thumbnailUrl: string;
    avgRating: number;
    reviewCount: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    favorites: { userId: string }[];
  },
  ctx: MapCourseContext
): CourseUI {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    level: course.level,
    duration: course.duration,
    thumbnailUrl: course.thumbnailUrl,
    avgRating: course.avgRating,
    reviewCount: course.reviewCount,
    category: course.category,
    isFavorite: !!ctx.userId && course.favorites.length > 0,
  };
}
