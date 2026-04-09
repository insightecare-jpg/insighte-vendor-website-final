"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

export default function SetupAuthPage() {
  const [status, setStatus] = useState<string>("Ready to initialize test accounts");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const setupAccounts = async () => {
    setLoading(true);
    setStatus("Cleaning up...");
    
    try {
      const accounts = [
        { email: "test-parent@insighte.com", role: "PARENT", name: "Test Parent" },
        { email: "test-therapist@insighte.com", role: "PROVIDER", name: "Test Therapist" },
        { email: "test-admin@insighte.com", role: "ADMIN", name: "Test Admin" },
      ];

      for (const acc of accounts) {
        setStatus(`Creating ${acc.role}: ${acc.email}...`);
        const { data, error } = await supabase.auth.signUp({
          email: acc.email,
          password: "insighte123",
          options: {
            data: {
              full_name: acc.name,
              role: acc.role,
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setStatus(`${acc.email} already exists. Skipping.`);
          } else {
            console.error(error);
            setStatus(`Error creating ${acc.email}: ${error.message}`);
            setLoading(false);
            return;
          }
        }
      }

      setStatus("Test accounts created! Now we must manually confirm them in SQL to bypass email verification.");
      setLoading(false);
    } catch (e: any) {
      setStatus(`Execution error: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111224] text-white p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">Fix Test Authentication</h1>
        <p className="text-[#a1a1a1]">{status}</p>
        <Button 
          onClick={setupAccounts} 
          disabled={loading}
          className="w-full h-14 bg-[#baccb3] text-[#111224] hover:bg-[#baccb3]/90 font-bold"
        >
          {loading ? "Processing..." : "Initialize Test Accounts Securely"}
        </Button>
      </div>
    </div>
  );
}
