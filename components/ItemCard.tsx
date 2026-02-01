import Link from "next/link";
import { PlayCircle, Code, Lock, CheckCircle } from "lucide-react";
import { CourseItemType } from "@prisma/client";

interface CourseItemCardProps {
  slug: string;
  title: string;
  type: CourseItemType;
  index: number;
  courseSlug: string;
  isEnrolled: boolean;
  completed: boolean;
}

export default function CourseItemCard({
  slug,
  title,
  type,
  index,
  courseSlug,
  isEnrolled,
  completed,
}: CourseItemCardProps) {
  const isModule = type === "MODULE";
  const Icon = isModule ? PlayCircle : Code;

  const isLocked = !isEnrolled;
  const href = isLocked ? "#" : `/courses/${courseSlug}/${slug}`;

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-4 p-5 transition-all
        ${
          isLocked
            ? "cursor-not-allowed opacity-70"
            : "hover:bg-slate-50 active:bg-slate-100"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-full
          transition-colors
          ${
            completed
              ? "bg-emerald-100 text-emerald-600"
              : isLocked
                ? "bg-slate-200 text-slate-400"
                : "bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white"
          }
        `}
      >
        {completed ? (
          <CheckCircle className="h-5 w-5" />
        ) : isLocked ? (
          <Lock className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={`
              truncate font-semibold transition-colors
              ${
                completed
                  ? "text-emerald-700"
                  : isLocked
                    ? "text-slate-500"
                    : "text-slate-800 group-hover:text-blue-600"
              }
            `}
          >
            {title || "Untitled Item"}
          </h3>

          {type === "WORKSHOP" && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">
              WORKSHOP
            </span>
          )}

          {completed && (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              COMPLETED
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">Lesson {index + 1}</p>
      </div>

      {/* Right icon */}
      <div className="text-slate-300">
        {completed ? (
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        ) : isLocked ? (
          <Lock className="h-4 w-4" />
        ) : (
          <PlayCircle className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </Link>
  );
}
