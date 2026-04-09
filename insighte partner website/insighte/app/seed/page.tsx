"use client";

import { seedInitialProviders } from "@/lib/actions/providers";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SeedPage() {
  const [status, setStatus] = useState<string>("Ready to seed");

  const runSeed = async () => {
    setStatus("Seeding...");
    try {
      const result = await seedInitialProviders();
      if (result.success) {
        setStatus(`Success! Seeded ${result.count} providers.`);
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">Seed Supabase</h1>
      <p>{status}</p>
      <Button onClick={runSeed}>Run Seeding Architecture</Button>
    </div>
  );
}
