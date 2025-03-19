import { useState, useEffect } from "react";
import {
  analyticsService,
  InventoryTrend,
  DonationTrend,
  RequestTrend,
} from "../services/analyticsService";

export function useAnalytics(
  timeRange: "week" | "month" | "quarter" | "year" = "month",
) {
  const [inventoryTrends, setInventoryTrends] = useState<InventoryTrend[]>([]);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [requestTrends, setRequestTrends] = useState<RequestTrend[]>([]);
  const [bloodTypeDistribution, setBloodTypeDistribution] = useState<
    { blood_type: string; count: number }[]
  >([]);
  const [hospitalDistribution, setHospitalDistribution] = useState<
    { hospital: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch all analytics data in parallel
        const [
          inventoryData,
          donationData,
          requestData,
          bloodTypeData,
          hospitalData,
        ] = await Promise.all([
          analyticsService.getInventoryTrends(timeRange),
          analyticsService.getDonationTrends(timeRange),
          analyticsService.getRequestTrends(timeRange),
          analyticsService.getBloodTypeDistribution(),
          analyticsService.getHospitalRequestDistribution(),
        ]);

        setInventoryTrends(inventoryData);
        setDonationTrends(donationData);
        setRequestTrends(requestData);
        setBloodTypeDistribution(bloodTypeData);
        setHospitalDistribution(hospitalData);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch analytics data"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const refreshAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data in parallel
      const [
        inventoryData,
        donationData,
        requestData,
        bloodTypeData,
        hospitalData,
      ] = await Promise.all([
        analyticsService.getInventoryTrends(timeRange),
        analyticsService.getDonationTrends(timeRange),
        analyticsService.getRequestTrends(timeRange),
        analyticsService.getBloodTypeDistribution(),
        analyticsService.getHospitalRequestDistribution(),
      ]);

      setInventoryTrends(inventoryData);
      setDonationTrends(donationData);
      setRequestTrends(requestData);
      setBloodTypeDistribution(bloodTypeData);
      setHospitalDistribution(hospitalData);
      setError(null);
    } catch (err) {
      console.error("Error refreshing analytics data:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh analytics data"),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    inventoryTrends,
    donationTrends,
    requestTrends,
    bloodTypeDistribution,
    hospitalDistribution,
    loading,
    error,
    refreshAnalytics,
  };
}
