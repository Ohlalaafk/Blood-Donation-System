import { useState, useEffect } from "react";
import {
  requestService,
  BloodRequest,
  RequestStatus,
} from "../services/requestService";

export function useRequests(status?: RequestStatus) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        let data;

        if (status) {
          data = await requestService.getRequestsByStatus(status);
        } else {
          data = await requestService.getRequests();
        }

        setRequests(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch requests"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [status]);

  const refreshRequests = async () => {
    try {
      setLoading(true);
      let data;

      if (status) {
        data = await requestService.getRequestsByStatus(status);
      } else {
        data = await requestService.getRequests();
      }

      setRequests(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing requests:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to refresh requests"),
      );
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (request: Omit<BloodRequest, "id">) => {
    try {
      const newRequest = await requestService.createRequest(request);
      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      console.error("Error creating request:", err);
      throw err;
    }
  };

  const updateRequest = async (
    requestId: string,
    updates: Partial<BloodRequest>,
  ) => {
    try {
      const updatedRequest = await requestService.updateRequest(
        requestId,
        updates,
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? updatedRequest : req)),
      );
      return updatedRequest;
    } catch (err) {
      console.error("Error updating request:", err);
      throw err;
    }
  };

  const approveRequest = async (
    requestId: string,
    approverId: string,
    notes?: string,
  ) => {
    try {
      const updatedRequest = await requestService.approveRequest(
        requestId,
        approverId,
        notes,
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? updatedRequest : req)),
      );
      return updatedRequest;
    } catch (err) {
      console.error("Error approving request:", err);
      throw err;
    }
  };

  const rejectRequest = async (
    requestId: string,
    approverId: string,
    notes?: string,
  ) => {
    try {
      const updatedRequest = await requestService.rejectRequest(
        requestId,
        approverId,
        notes,
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? updatedRequest : req)),
      );
      return updatedRequest;
    } catch (err) {
      console.error("Error rejecting request:", err);
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    refreshRequests,
    createRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
  };
}
