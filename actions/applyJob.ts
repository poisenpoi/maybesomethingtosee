"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function applyJob(jobId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "EDUCATEE") return;

  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId },
  });

  if (!job) return;
  if (job.status !== "PUBLISHED") return;
  if (job.userId === user.id) return;

  const existing = await prisma.jobApplication.findUnique({
    where: {
      userId_jobId: {
        userId: user.id,
        jobId,
      },
    },
  });

  if (existing) return;

  await prisma.$transaction([
    prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobId,
      },
    }),

    prisma.profile.update({
      where: { userId: job.userId },
      data: {
        totalApplicants: { increment: 1 },
      },
    }),

    prisma.jobPosting.update({
      where: { id: jobId },
      data: {
        applicators: { increment: 1 },
      },
    }),
  ]);

  revalidatePath(`/jobs/${job.slug}`);
}
