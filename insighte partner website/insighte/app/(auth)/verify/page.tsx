import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Check Your Email - Insighte',
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0d0f1a] flex items-center justify-center p-4 text-center" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div className="w-full max-w-md space-y-6">
        <div className="w-20 h-20 bg-[#8b7ff0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#8b7ff0]" />
        </div>
        <h1 className="text-3xl font-serif text-[#f0ece4]">Check your inbox</h1>
        <p className="text-[#8a8591] leading-relaxed">
          We've sent you a verification link. Please click the link in your email to verify your account and sign in.
        </p>
        <div className="pt-8">
           <Link href="/login" className="px-8 py-3 rounded-full border border-white/20 text-[#e8e2d8] hover:bg-white/5 transition-colors font-bold text-sm tracking-widest uppercase">
             Return to Login
           </Link>
        </div>
      </div>
    </div>
  );
}
