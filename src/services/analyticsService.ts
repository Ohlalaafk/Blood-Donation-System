import { supabase } from "../lib/supabase";

export interface InventoryTrend {
  blood_type: string;
  date: string;
  units: number;
  capacity: number;
}

export interface DonationTrend {
  date: string;
  count: number;
  donation_type?: string;
}

export interface RequestTrend {
  date: string;
  count: number;
  status?: string;
}

export const analyticsService = {
  async getInventoryTrends(
    timeRange: "week" | "month" | "quarter" | "year" = "month",
  ) {
    const days =
      timeRange === "week"
        ? 7
        : timeRange === "month"
          ? 30
          : timeRange === "quarter"
            ? 90
            : 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("inventory_history")
      .select("blood_type, date, units, capacity")
      .gte("date", startDate.toISOString())
      .order("date", { ascending: true });

    if (error) throw error;
    return data as InventoryTrend[];
  },

  async getDonationTrends(
    timeRange: "week" | "month" | "quarter" | "year" = "month",
    donationType?: string,
  ) {
    const days =
      timeRange === "week"
        ? 7
        : timeRange === "month"
          ? 30
          : timeRange === "quarter"
            ? 90
            : 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase.rpc("get_donation_trends", {
      start_date: startDate.toISOString(),
    });

    if (donationType) {
      query = query.eq("donation_type", donationType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as DonationTrend[];
  },

  async getRequestTrends(
    timeRange: "week" | "month" | "quarter" | "year" = "month",
    status?: string,
  ) {
    const days =
      timeRange === "week"
        ? 7
        : timeRange === "month"
          ? 30
          : timeRange === "quarter"
            ? 90
            : 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase.rpc("get_request_trends", {
      start_date: startDate.toISOString(),
    });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as RequestTrend[];
  },

  async getBloodTypeDistribution() {
    const { data, error } = await supabase.rpc("get_blood_type_distribution");

    if (error) throw error;
    return data as { blood_type: string; count: number }[];
  },

  async getHospitalRequestDistribution() {
    const { data, error } = await supabase.rpc(
      "get_hospital_request_distribution",
    );

    if (error) throw error;
    return data as { hospital: string; count: number }[];
  },
};
