import React from "react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import ApprovalQueue from "./_components/ApprovalQueue";
import SpecialistsTable from "./_components/SpecialistsTable";

export default async function AdminSpecialistsPage() {
  const supabase = await createClient();
  
  // Fetch pending count separately for header logic
  const { count: pendingCount } = await supabase
    .from('partners')
    .select('id', { count: 'exact', head: true })
    .eq('approval_status', 'PENDING_REVIEW');

  return (
    <div className="min-h-screen bg-[#111224] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      
      {/* INSTITUTIONAL HEADER */}
      <section className="space-y-4">
        <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
          Institutional Governance // Hub
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black font-manrope tracking-tighter italic uppercase text-white leading-none">
          Specialist <br/> <span className="text-[#BACCB3]">Ecosystem.</span>
        </h1>
      </section>

      {/* ZONE A: PENDING APPROVALS */}
      {pendingCount ? (
        <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
           <ApprovalQueue count={pendingCount || 0} />
        </section>
      ) : null}

      {/* ZONE B: MAIN ROSTER */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#7c6ff7]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Active Roster // Clinical Registry</h2>
        </div>
        <SpecialistsTable />
      </section>

    </div>
  );
}
