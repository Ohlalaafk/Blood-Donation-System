import { supabase } from "../lib/supabase";

export interface DonorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  blood_type?: string;
  address?: string;
  registration_date: string;
  last_donation?: string;
  total_donations?: number;
  eligibility_status?: "eligible" | "ineligible" | "pending";
  eligibility_reason?: string;
  next_eligible_date?: string;
}

export interface MedicalInfo {
  donor_id: string;
  weight?: number;
  height?: number;
  allergies?: string[];
  medications?: string[];
  medical_conditions?: string[];
  last_health_check?: string;
  hemoglobin_level?: number;
  blood_pressure?: string;
  pulse?: number;
}

export interface DonationRecord {
  id: string;
  donor_id: string;
  date: string;
  location: string;
  donation_type: "whole blood" | "plasma" | "platelets" | "double red cells";
  status: "completed" | "deferred" | "cancelled";
  hemoglobin: number;
  volume: number;
  notes?: string;
}

export interface DonationAppointment {
  id: string;
  donor_id: string;
  date: string;
  time: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "donation" | "appointment" | "eligibility";
}

export const donorService = {
  async getDonorProfile(donorId: string) {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("id", donorId)
      .single();

    if (error) throw error;
    return data as DonorProfile;
  },

  async updateDonorProfile(donorId: string, profile: Partial<DonorProfile>) {
    const { data, error } = await supabase
      .from("donors")
      .update(profile)
      .eq("id", donorId)
      .select()
      .single();

    if (error) throw error;
    return data as DonorProfile;
  },

  async getMedicalInfo(donorId: string) {
    const { data, error } = await supabase
      .from("medical_info")
      .select("*")
      .eq("donor_id", donorId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
    return data as MedicalInfo;
  },

  async updateMedicalInfo(donorId: string, medicalInfo: Partial<MedicalInfo>) {
    // Check if medical info exists
    const { data: existingData } = await supabase
      .from("medical_info")
      .select("donor_id")
      .eq("donor_id", donorId)
      .single();

    let data;
    let error;

    if (existingData) {
      // Update existing record
      const response = await supabase
        .from("medical_info")
        .update(medicalInfo)
        .eq("donor_id", donorId)
        .select()
        .single();

      data = response.data;
      error = response.error;
    } else {
      // Insert new record
      const response = await supabase
        .from("medical_info")
        .insert({ donor_id: donorId, ...medicalInfo })
        .select()
        .single();

      data = response.data;
      error = response.error;
    }

    if (error) throw error;
    return data as MedicalInfo;
  },

  async getDonationHistory(donorId: string) {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("donor_id", donorId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data as DonationRecord[];
  },

  async getAppointments(donorId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("donor_id", donorId)
      .order("date", { ascending: true });

    if (error) throw error;
    return data as DonationAppointment[];
  },

  async scheduleAppointment(appointment: Omit<DonationAppointment, "id">) {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data as DonationAppointment;
  },

  async updateAppointment(
    appointmentId: string,
    updates: Partial<DonationAppointment>,
  ) {
    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data as DonationAppointment;
  },

  async cancelAppointment(appointmentId: string) {
    return this.updateAppointment(appointmentId, { status: "cancelled" });
  },
};
