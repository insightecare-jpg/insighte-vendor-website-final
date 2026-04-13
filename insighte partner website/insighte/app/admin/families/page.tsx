import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsTab from './_components/ClientsTab';
import PackagesTab from './_components/PackagesTab';
import ReportsTab from './_components/ReportsTab';
import DeletedTab from './_components/DeletedTab';

export default async function AdminFamiliesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'clients' } = await searchParams;

  return (
    <div className="min-h-screen bg-[#111224] p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
            Institutional Registry // Families
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-manrope tracking-tighter italic uppercase text-white leading-none">
            Clinical <br/> <span className="text-[#d3c4b5]">Ecosystem.</span>
          </h1>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <Tabs defaultValue={tab} className="w-full space-y-8">
        <TabsList className="bg-[#191a2d] border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto overflow-x-auto scrollbar-hide flex">
          <TabsTrigger value="clients" className="flex-1 md:flex-none px-8 h-full rounded-xl data-[state=active]:bg-[#baccb3] data-[state=active]:text-[#111224] text-[#c8c5cd] font-black uppercase tracking-widest text-[10px] transition-all">
            Clients
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex-1 md:flex-none px-8 h-full rounded-xl data-[state=active]:bg-[#baccb3] data-[state=active]:text-[#111224] text-[#c8c5cd] font-black uppercase tracking-widest text-[10px] transition-all">
            Packages
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 md:flex-none px-8 h-full rounded-xl data-[state=active]:bg-[#baccb3] data-[state=active]:text-[#111224] text-[#c8c5cd] font-black uppercase tracking-widest text-[10px] transition-all">
            Reports
          </TabsTrigger>
          <TabsTrigger value="deleted" className="flex-1 md:flex-none px-8 h-full rounded-xl data-[state=active]:bg-[#baccb3] data-[state=active]:text-[#111224] text-[#c8c5cd] font-black uppercase tracking-widest text-[10px] transition-all">
            Deleted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="focus-visible:outline-none">
          <ClientsTab />
        </TabsContent>
        <TabsContent value="packages" className="focus-visible:outline-none">
          <PackagesTab />
        </TabsContent>
        <TabsContent value="reports" className="focus-visible:outline-none">
          <ReportsTab />
        </TabsContent>
        <TabsContent value="deleted" className="focus-visible:outline-none">
          <DeletedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
