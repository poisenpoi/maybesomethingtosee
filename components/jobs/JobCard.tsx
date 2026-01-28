import Link from "next/link";
import { JobUI } from "@/types/job.ui";
import { WorkMode } from "@prisma/client";

export default function JobCard({
  job,
}: {
  job: JobUI;
  isAuthenticated: boolean;
}) {
  const WORK_MODE_LABELS: Record<WorkMode, string> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    return "Just now";
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <Link
            href={`/jobs/${job.slug}`}
            className="block text-lg font-bold text-slate-900 uppercase tracking-tight hover:text-blue-600 transition-colors line-clamp-2"
          >
            {job.title}
          </Link>
          <p className="text-base font-medium text-slate-700 mt-2">
            {job.user.profile?.name || "Unknown Company"}
          </p>
        </div>

        <div className="shrink-0">
          <div className="w-14 h-14 relative rounded-lg overflow-hidden">
            <img
              src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
              alt="Logo"
              className="w-full h-full object-contain object-right-top"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 mb-6">
        <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
          {job.user.profile?.companyAddress || "Remote"}{" "}
          <span className="text-slate-400 font-normal">
            ({WORK_MODE_LABELS[job.workMode]})
          </span>
        </p>
      </div>

      <div className="grow mb-6">
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
          {job.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium">
          Posted {timeAgo(job.createdAt)}
        </span>
      </div>
    </div>
  );
}