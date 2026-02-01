"use client";

import { useActionState, useEffect, useState } from "react";
import { createJobAction } from "@/actions/jobManagement";
import { useRouter } from "next/navigation";
import { JobCategory } from "@prisma/client";

export default function CreateJobPopover({
  categories,
}: {
  categories: JobCategory[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createJobAction, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Create Job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] rounded-xl bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="shrink-0 border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Job</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <form
              id="job-form"
              action={formAction}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title
                </label>
                <input
                  name="title"
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  className="w-full rounded-md border px-3 py-2 resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  name="location"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {/* Category + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              {/* Mode + Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Mode
                  </label>
                  <select
                    name="mode"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience Level
                  </label>
                  <select
                    name="level"
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">Any</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="paycheckMin"
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="paycheckMax"
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              </div>

              {/* Expiration + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expiredDate"
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>
            </form>

            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}

            <div className="shrink-0 border-t bg-white px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="job-form"
                disabled={isPending}
                className="rounded-md bg-eduBlue px-5 py-2 text-sm text-white"
              >
                {isPending ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
