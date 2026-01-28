"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Filter, ChevronDown, X, Briefcase } from "lucide-react";
import JobCard from "./JobCard";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryUI } from "@/types/category.ui";
import { JobUI } from "@/types/job.ui";
import { ExperienceLevel, JobType, WorkMode } from "@prisma/client";

type JobsProps = {
  jobs: JobUI[];
  categories: CategoryUI[];
  isAuthenticated: boolean;
};

const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

const TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

export default function Jobs({ jobs, categories, isAuthenticated }: JobsProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const [salaryMin, setSalaryMin] = useState(params.get("min") || "");
  const [salaryMax, setSalaryMax] = useState(params.get("max") || "");

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(params);
    mutator(next);
    router.push(`/jobs?${next.toString()}`, { scroll: false });
  }

  function handleCategoryToggle(category: string): void {
    updateParams((params) => {
      const selected = params.getAll("category");
      params.delete("category");
      if (selected.includes(category)) {
        selected
          .filter((l) => l !== category)
          .forEach((l) => params.append("category", l));
      } else {
        selected.forEach((l) => params.append("category", l));
        params.append("category", category);
      }
    });
  }

  function handleFilterToggle(key: string, value: string): void {
    updateParams((params) => {
      const selected = params.getAll(key);
      params.delete(key);
      if (selected.includes(value)) {
        selected
          .filter((l) => l !== value)
          .forEach((l) => params.append(key, l));
      } else {
        selected.forEach((l) => params.append(key, l));
        params.append(key, value);
      }
    });
  }

  function applySalaryFilter() {
    updateParams((params) => {
      salaryMin ? params.set("min", salaryMin) : params.delete("min");
      salaryMax ? params.set("max", salaryMax) : params.delete("max");
    });
  }

  function handleSort(value: string): void {
    updateParams((params) => {
      value === "default" ? params.delete("sort") : params.set("sort", value);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">Explore Jobs</h1>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`
            fixed inset-0 z-40 bg-white lg:bg-transparent lg:static lg:block lg:w-72 lg:shrink-0
            transform transition-transform duration-300 ease-in-out
            ${
              mobileFiltersOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="h-full overflow-y-auto p-6 lg:p-0">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    Job Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={params
                            .getAll("category")
                            .includes(category.slug)}
                          onChange={() => handleCategoryToggle(category.slug)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Experience Level
                  </h3>
                  <div className="space-y-2">
                    {Object.values(ExperienceLevel).map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={params.getAll("level").includes(level)}
                          onChange={() => handleFilterToggle("level", level)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-blue-600">
                          {EXPERIENCE_LEVEL_LABELS[level]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Job Type
                  </h3>
                  <div className="space-y-2">
                    {Object.values(JobType).map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={params.getAll("type").includes(type)}
                          onChange={() => handleFilterToggle("type", type)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-blue-600">
                          {TYPE_LABELS[type]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Work Mode
                  </h3>
                  <div className="space-y-2">
                    {Object.values(WorkMode).map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={params.getAll("mode").includes(mode)}
                          onChange={() => handleFilterToggle("mode", mode)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-blue-600 capitalize">
                          {mode.toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Salary Range (Rp)
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applySalaryFilter}
                    className="w-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>

              <Link
                href="/jobs"
                className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
              >
                Clear all filters
              </Link>
            </div>

            {mobileFiltersOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-[-1] lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-slate-600">
                Showing{" "}
                <span className="font-bold text-slate-900">{jobs.length}</span>{" "}
                jobs
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={params.get("sort") ?? "default"}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 pl-3 pr-8 py-1.5 rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="salary_high">Highest Salary</option>
                    <option value="salary_low">Lowest Salary</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No jobs found matching criteria
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  Try adjusting your filters or search for a broader category.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}