"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { approveProvider } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

export function ReviewActions({ providerId }: { providerId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveProvider(providerId);
      if (result.success) {
        router.push("/admin/queue");
      } else {
        alert("Error approving provider: " + result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-6">
      <button 
        disabled={isPending}
        className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all underline underline-offset-8 disabled:opacity-50"
      >
        Request Info
      </button>
      <Button 
        onClick={handleApprove}
        disabled={isPending}
        className="h-16 px-12 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-2xl flex items-center gap-4 group disabled:opacity-70"
      >
        {isPending ? (
          <>APPROVING <Loader2 className="h-5 w-5 animate-spin" /></>
        ) : (
          <>APPROVE <Check className="h-5 w-5 group-hover:scale-110 transition-transform" /></>
        )}
      </Button>
    </div>
  );
}
