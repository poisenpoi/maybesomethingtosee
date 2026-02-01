import { CategoryUI } from "@/types/category.ui";
import { prisma } from "../prisma";
import { cache } from "react";

export const getCategories = cache(async (): Promise<CategoryUI[]> => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
});
