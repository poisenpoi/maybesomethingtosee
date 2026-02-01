import { Metadata } from "next";
import LearningPaths from "@/components/path/LearningPaths";
import { getPaths } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Learning Paths | EduTIA",
  description:
    "Structured paths to help you master new skills and technologies.",
};

export default async function Page() {
  const learningPaths = await getPaths();

  return <LearningPaths learningPaths={learningPaths} />;
}
