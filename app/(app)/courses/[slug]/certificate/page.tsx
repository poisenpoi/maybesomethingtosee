import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import BackButton from "@/components/BackButton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!course) {
    return { title: "Certificate Not Found" };
  }

  return {
    title: `Certificate - ${course.title} | Learning Platform`,
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/courses/${slug}/certificate`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    include: {
      certificate: true,
    },
  });

  const isCompleted = enrollment?.status === "COMPLETED";

  if (!isCompleted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200 mt-10">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Certificate Not Available Yet
          </h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You must complete all modules and workshops in <strong>{course.title}</strong> to unlock your certificate.
          </p>
          <div className="w-full max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(enrollment?.progressPercent || 0)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-eduBlue h-full transition-all duration-300"
                style={{ width: `${enrollment?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userName = user.profile?.name || user.email.split("@")[0];
  const completionDate = enrollment.certificate?.issuedAt || enrollment.updatedAt || new Date();
  const certificateId = enrollment.certificate?.certificateCode;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="print:hidden mb-6">
        <BackButton />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-2 rounded-xl shadow-lg print:shadow-none print:w-full">
          <div className="border-[12px] border-double border-eduBlue/20 p-8 md:p-16 text-center relative overflow-hidden bg-[#fafafa]">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-eduBlue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 mb-12">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-wider uppercase">
                Certificate
              </h1>
              <p className="text-xl md:text-2xl font-serif text-slate-500 uppercase tracking-[0.2em]">
                of Completion
              </p>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <p className="text-slate-500 text-lg font-medium italic">This certifies that</p>
                <h2 className="text-3xl md:text-5xl font-bold text-eduBlue font-serif border-b-2 border-slate-200 inline-block px-12 pb-4">
                  {userName}
                </h2>
              </div>

              <div className="space-y-4 py-4">
                <p className="text-slate-500 text-lg font-medium italic">
                  Has successfully completed the course
                </p>
                <h3 className="text-2xl md:text-4xl font-bold text-slate-800 font-serif">
                  {course.title}
                </h3>
              </div>
            </div>

            <div className="relative z-10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-10 text-slate-600">
              
              <div className="text-center">
                <div className="px-8 py-2">
                  <p className="text-2xl font-serif font-bold text-slate-800">
                    {completionDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Date Issued
                </p>
              </div>

              {certificateId && (
                <div className="order-first md:order-none">
                  <div className="w-24 h-24 mx-auto border-4 border-eduBlue/20 rounded-full flex items-center justify-center bg-white shadow-sm">
                    <div className="text-center">
                       <span className="block text-2xl">🎓</span>
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-400">
                    ID: {certificateId}
                  </p>
                </div>
              )}

              <div className="text-center">
                <div className="px-8 py-2 border-t border-slate-400">
                  <div className="h-7 flex items-end justify-center">
                     <span className="font-serif italic text-xl text-eduBlue">LearningPlatform</span>
                  </div>
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Verified Signature
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}