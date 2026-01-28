import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PathDetails from "@/components/path/PathDetail";
import { getCurrentUser } from "@/lib/auth";
import { PathDetailUI } from "@/types/path.ui";
import { getNextPathCourseSlug } from "@/actions/resume";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = await prisma.learningPath.findUnique({
    where: { slug },
  });

  if (!path) {
    return {
      title: "Path Not Found",
    };
  }

  return {
    title: `${path.title} | Learning Path`,
    description: path.description,
  };
}

export default async function PathDetailsPage({ params }: Props) {
  const user = await getCurrentUser();
  const { slug } = await params;

  const path = await prisma.learningPath.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { position: "asc" },
        include: {
          course: {
            include: {
              category: true,
              _count: {
                select: {
                  items: true,
                  favorites: {
                    where: user ? { userId: user.id } : { userId: "__none__" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!path) notFound();

  const pathDetail: PathDetailUI = {
    ...path,
    items: path.items.map((item) => ({
      ...item,
      course: {
        ...item.course,
        isFavorite: item.course._count.favorites > 0,
      },
    })),
  };

  const nextCourseSlug = await getNextPathCourseSlug(path.id);

  const safeCourseSlug = nextCourseSlug ?? "";

  return (
    <PathDetails
      path={pathDetail}
      isAuthenticated={!!user}
      nextCourseSlug={safeCourseSlug}
    />
  );
}
