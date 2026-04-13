import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pending Approval - Insighte',
};

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-[#0d0f1a] flex items-center justify-center p-4 text-center" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div className="w-full max-w-md bg-white/5 border border-[#8b7ff0]/20 rounded-3xl p-10 backdrop-blur-xl">
        <div className="w-16 h-16 bg-[#8b7ff0]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#8b7ff0]/30 shadow-[0_0_30px_rgba(139,127,240,0.2)]">
          <ShieldCheck className="w-8 h-8 text-[#8b7ff0]" />
        </div>
        <h1 className="text-2xl font-serif text-[#f0ece4] mb-3">Application Under Review</h1>
        <p className="text-[#8a8591] text-sm leading-relaxed mb-8">
          Thank you for joining Insighte as a provider. Our clinical team is reviewing your profile. We will notify you once your account has been approved to take bookings.
        </p>
        <Link href="/" className="px-8 py-3 rounded-xl bg-white/10 text-[#e8e2d8] hover:bg-white/20 transition-colors font-bold text-xs tracking-widest uppercase inline-block">
           Return Home
        </Link>
      </div>
    </div>
  );
}
