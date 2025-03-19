import { supabase } from "../lib/supabase";

export type RequestStatus = "pending" | "approved" | "rejected" | "urgent";
export type RequestPriority = "low" | "medium" | "high";

export interface BloodRequest {
  id: string;
  request_date: string;
  hospital: string;
  blood_type: string;
  quantity: number;
  status: RequestStatus;
  priority: RequestPriority;
  requester_id: string;
  approver_id?: string;
  notes?: string;
}

export const requestService = {
  async getRequests() {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .order("request_date", { ascending: false });

    if (error) throw error;
    return data as BloodRequest[];
  },

  async getRequestsByStatus(status: RequestStatus) {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("status", status)
      .order("request_date", { ascending: false });

    if (error) throw error;
    return data as BloodRequest[];
  },

  async getRequestsByHospital(hospital: string) {
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("hospital", hospital)
      .order("request_date", { ascending: false });

    if (error) throw error;
    return data as BloodRequest[];
  },

  async createRequest(request: Omit<BloodRequest, "id">) {
    const { data, error } = await supabase
      .from("blood_requests")
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data as BloodRequest;
  },

  async updateRequest(requestId: string, updates: Partial<BloodRequest>) {
    const { data, error } = await supabase
      .from("blood_requests")
      .update(updates)
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data as BloodRequest;
  },

  async approveRequest(requestId: string, approverId: string, notes?: string) {
    return this.updateRequest(requestId, {
      status: "approved",
      approver_id: approverId,
      notes,
    });
  },

  async rejectRequest(requestId: string, approverId: string, notes?: string) {
    return this.updateRequest(requestId, {
      status: "rejected",
      approver_id: approverId,
      notes,
    });
  },

  async markRequestUrgent(requestId: string) {
    return this.updateRequest(requestId, { status: "urgent" });
  },
};
