import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 animate-fade-in-slow italic">
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight size={14} className="text-zinc-800" strokeWidth={3} />}
          <Link 
            href={item.href}
            className={`hover:text-[#D3C4B5] transition-colors ${index === items.length - 1 ? 'text-zinc-600 cursor-default' : ''}`}
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}

import React from "react";
