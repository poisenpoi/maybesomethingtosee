"use client";

import { deleteJob } from "@/actions/jobManagement";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
      >
        Delete Job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Job Posting
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. All applications will be permanently
              deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteJob(jobId);
                  router.push("/dashboard");
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
