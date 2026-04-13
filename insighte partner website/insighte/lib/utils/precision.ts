/**
 * Clinical Precision Scoring Logic
 * Matches Child Diagnoses against Provider Specialisations/Programs
 */

export const calculatePrecisionScore = (
  childDiagnoses: string[] = [], 
  providerSpecs: string[] = []
): number => {
  if (childDiagnoses.length === 0) return 0;
  
  // Normalize strings
  const normalizedChild = childDiagnoses.map(d => d.toLowerCase());
  const normalizedSpecs = providerSpecs.map(s => s.toLowerCase());

  let matches = 0;
  
  // Simple intersection matching
  normalizedChild.forEach(diagnosis => {
    // Check for direct matches or partial keyword overlap
    const hasMatch = normalizedSpecs.some(spec => 
      spec.includes(diagnosis) || diagnosis.includes(spec)
    );
    if (hasMatch) matches++;
  });

  // Calculate percentage based on child's needs met
  const baseScore = (matches / childDiagnoses.length) * 100;
  
  // High fidelity smoothing (if no match, baseline of 0, if some match, boost)
  return Math.round(baseScore);
};

export const getPrecisionLabel = (score: number) => {
  if (score >= 90) return { label: "Elite Match", color: "text-[#BACCB3]" };
  if (score >= 70) return { label: "High Protocol", color: "text-[#D3C4B5]" };
  if (score >= 40) return { label: "Compatible", color: "text-[#BDBDBD]" };
  return { label: "Discovery Mode", color: "text-zinc-600" };
};
