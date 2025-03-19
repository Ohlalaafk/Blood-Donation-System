import { useState, useEffect } from "react";
import { donorService, DonationRecord } from "../services/donorService";

export function useDonationHistory(donorId: string) {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!donorId) return;

    const fetchDonationHistory = async () => {
      try {
        setLoading(true);
        const data = await donorService.getDonationHistory(donorId);
        setDonations(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch donation history"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [donorId]);

  const refreshDonationHistory = async () => {
    if (!donorId) return;

    try {
      setLoading(true);
      const data = await donorService.getDonationHistory(donorId);
      setDonations(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing donation history:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh donation history"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalDonations = donations.filter(
    (d) => d.status === "completed",
  ).length;
  const totalVolume = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.volume, 0);
  const lastDonation =
    donations.length > 0
      ? donations.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0]
      : null;

  return {
    donations,
    loading,
    error,
    refreshDonationHistory,
    stats: {
      totalDonations,
      totalVolume,
      lastDonation,
    },
  };
}
