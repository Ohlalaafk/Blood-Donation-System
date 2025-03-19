import { supabase } from "../lib/supabase";

export interface BloodInventory {
  id: string;
  blood_type: string;
  units: number;
  capacity: number;
  status: "critical" | "low" | "normal" | "excess";
  location: string;
  last_updated: string;
}

export interface InventoryHistory {
  id: string;
  blood_type: string;
  units: number;
  date: string;
  location: string;
}

export const inventoryService = {
  async getInventory() {
    const { data, error } = await supabase.from("blood_inventory").select("*");

    if (error) throw error;
    return data as BloodInventory[];
  },

  async getInventoryByType(bloodType: string) {
    const { data, error } = await supabase
      .from("blood_inventory")
      .select("*")
      .eq("blood_type", bloodType);

    if (error) throw error;
    return data as BloodInventory[];
  },

  async getInventoryByLocation(location: string) {
    const { data, error } = await supabase
      .from("blood_inventory")
      .select("*")
      .eq("location", location);

    if (error) throw error;
    return data as BloodInventory[];
  },

  async updateInventory(inventoryId: string, updates: Partial<BloodInventory>) {
    const { data, error } = await supabase
      .from("blood_inventory")
      .update({
        ...updates,
        last_updated: new Date().toISOString(),
      })
      .eq("id", inventoryId)
      .select()
      .single();

    if (error) throw error;
    return data as BloodInventory;
  },

  async getInventoryHistory(bloodType?: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from("inventory_history")
      .select("*")
      .gte("date", startDate.toISOString())
      .order("date", { ascending: true });

    if (bloodType) {
      query = query.eq("blood_type", bloodType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as InventoryHistory[];
  },
};
