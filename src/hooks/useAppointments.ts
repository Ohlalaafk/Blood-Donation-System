import { useState, useEffect } from "react";
import { donorService, DonationAppointment } from "../services/donorService";

export function useAppointments(donorId: string) {
  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!donorId) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await donorService.getAppointments(donorId);
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch appointments"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [donorId]);

  const refreshAppointments = async () => {
    if (!donorId) return;

    try {
      setLoading(true);
      const data = await donorService.getAppointments(donorId);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing appointments:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh appointments"),
      );
    } finally {
      setLoading(false);
    }
  };

  const scheduleAppointment = async (
    appointment: Omit<DonationAppointment, "id" | "donor_id">,
  ) => {
    if (!donorId) return null;

    try {
      const newAppointment = await donorService.scheduleAppointment({
        ...appointment,
        donor_id: donorId,
      });
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      throw err;
    }
  };

  const updateAppointment = async (
    appointmentId: string,
    updates: Partial<DonationAppointment>,
  ) => {
    try {
      const updatedAppointment = await donorService.updateAppointment(
        appointmentId,
        updates,
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? updatedAppointment : app,
        ),
      );
      return updatedAppointment;
    } catch (err) {
      console.error("Error updating appointment:", err);
      throw err;
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const updatedAppointment =
        await donorService.cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? updatedAppointment : app,
        ),
      );
      return updatedAppointment;
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      throw err;
    }
  };

  // Get upcoming appointment (first scheduled appointment in the future)
  const upcomingAppointment =
    appointments
      .filter(
        (app) => app.status === "scheduled" && new Date(app.date) >= new Date(),
      )
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0] || null;

  return {
    appointments,
    upcomingAppointment,
    loading,
    error,
    refreshAppointments,
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
  };
}
