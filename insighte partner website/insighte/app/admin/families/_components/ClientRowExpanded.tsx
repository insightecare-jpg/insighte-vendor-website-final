"use client";

import React from 'react';
import ChildrenColumn from './ChildrenColumn';
import SessionHistoryColumn from './SessionHistoryColumn';
import QuickScheduleForm from './QuickScheduleForm';

export default function ClientRowExpanded({ family }: { family: any }) {
  return (
    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 animate-in slide-in-from-top-4 duration-500">
      
      {/* COLUMN 1: CHILDREN & SERVICES (30%) */}
      <div className="lg:w-[30%] p-8">
        <ChildrenColumn family={family} />
      </div>

      {/* COLUMN 2: SESSION HISTORY (40%) */}
      <div className="lg:w-[40%] p-8 bg-white/[0.02]">
        <SessionHistoryColumn family={family} />
      </div>

      {/* COLUMN 3: QUICK SCHEDULE (30%) */}
      <div className="lg:w-[30%] p-8">
        <QuickScheduleForm family={family} />
      </div>

    </div>
  );
}
