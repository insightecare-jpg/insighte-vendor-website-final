import { getPrograms } from "@/lib/actions/programs";
import { ProgramsClient } from "./ProgramsClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Clinical Programs & Support Groups | Insighte Care",
  description: "Explore our neuro-affirming care pathways including home therapy, shadow teaching, clinical courses, and community support groups.",
};

export default async function ProgramsPage() {
  const allPrograms = (await getPrograms()) || [];
  
  const coreServices = allPrograms.filter((p: any) => p?.type === 'core_service');
  const courses = allPrograms.filter((p: any) => p?.type === 'course');
  const groups = allPrograms.filter((p: any) => p?.type === 'support_group');

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-[#e8e2d8] selection:bg-[#8b7ff0/30]">
      <Navbar />
      <ProgramsClient 
        initialServices={coreServices}
        initialCourses={courses}
        initialGroups={groups}
      />
      <Footer />
    </div>
  );
}
