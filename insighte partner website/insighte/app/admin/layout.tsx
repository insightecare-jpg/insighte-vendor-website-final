"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { 
  Search, 
  Bell, 
  Moon, 
  User, 
  Settings 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111224] text-white selection:bg-[#D3C4B5]/30">
       <AdminSidebar />

       {/* MAIN CONTENT AREA */}
       <div className="flex-1 lg:ml-72 flex flex-col pt-12">
          {/* TOP BAR */}
          <header className="px-8 flex items-center justify-between h-20 animate-fade-in-up">
             {/* SEARCH POD */}
             <div className="relative group max-w-md flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-[#D3C4B5] transition-colors" />
                <Input 
                   type="text" 
                   placeholder="Search applicants, specialties..." 
                   className="h-16 w-full rounded-full bg-[#1D1E31] border-none px-16 text-md font-medium placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-[#D3C4B5]/30 shadow-inner"
                />
             </div>

             {/* ACTIONS POD */}
             <div className="flex items-center gap-8 pl-12">
                <div className="flex items-center gap-6">
                   <button className="h-12 w-12 rounded-full flex items-center justify-center hover:bg-white/5 text-zinc-600 hover:text-white transition-all">
                      <Bell className="h-6 w-6" />
                   </button>
                   <button className="h-12 w-12 rounded-full flex items-center justify-center hover:bg-white/5 text-zinc-600 hover:text-white transition-all">
                      <Moon className="h-6 w-6" />
                   </button>
                </div>

                <div className="h-12 w-[1px] bg-white/5 mx-2" />

                {/* ADMIN PROFILE */}
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                      <button className="vessel h-14 pr-4 pl-4 rounded-full flex items-center gap-4 hover:bg-[#1D1E31] transition-all border border-white/5 bg-[#111224]">
                         <div className="text-right hidden sm:block">
                            <p className="text-sm font-extrabold font-manrope tracking-tighter">Admin Profile</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Senior Registrar</p>
                         </div>
                         <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src="/avatars/admin_p.png" />
                            <AvatarFallback>AP</AvatarFallback>
                         </Avatar>
                      </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent className="bg-[#1D1E31] border-white/10 text-white p-2 rounded-3xl w-56">
                      <DropdownMenuItem className="h-12 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-3 text-sm font-bold">
                         <User className="h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="h-12 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-3 text-sm font-bold">
                         <Settings className="h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      <div className="h-[1px] bg-white/5 my-2" />
                      <DropdownMenuItem className="h-12 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-3 text-sm font-bold text-red-400">
                         Sign Out
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="p-8 flex-1 animate-fade-in-up stagger-1">
             {children}
          </main>
       </div>
    </div>
  );
}
