import { useQuery } from "@tanstack/react-query";

export function useScripts(businessId: string) {
  return useQuery({
    queryKey: ["scripts", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/scripts`);
      if (!res.ok) throw new Error("Failed to load scripts");
      return res.json();
    },
    enabled: !!businessId
  });
}
