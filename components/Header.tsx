import HeaderClient from "./Header.client";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/data/categories";

export default async function Header() {
  const user = await getCurrentUser();
  const categories = await getCategories();

  return <HeaderClient user={user} categories={categories} />;
}
