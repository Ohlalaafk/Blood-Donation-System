import { useState, useEffect } from "react";
import {
  donorService,
  DonorProfile,
  MedicalInfo,
} from "../services/donorService";

export function useDonorProfile(donorId: string) {
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!donorId) return;

    const fetchDonorData = async () => {
      try {
        setLoading(true);

        // Fetch profile and medical info in parallel
        const [profileData, medicalData] = await Promise.all([
          donorService.getDonorProfile(donorId),
          donorService.getMedicalInfo(donorId).catch(() => null), // Medical info might not exist yet
        ]);

        setProfile(profileData);
        setMedicalInfo(medicalData);
        setError(null);
      } catch (err) {
        console.error("Error fetching donor data:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch donor data"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [donorId]);

  const updateProfile = async (updates: Partial<DonorProfile>) => {
    if (!donorId) return null;

    try {
      const updatedProfile = await donorService.updateDonorProfile(
        donorId,
        updates,
      );
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error("Error updating donor profile:", err);
      throw err;
    }
  };

  const updateMedicalInfo = async (updates: Partial<MedicalInfo>) => {
    if (!donorId) return null;

    try {
      const updatedMedicalInfo = await donorService.updateMedicalInfo(
        donorId,
        updates,
      );
      setMedicalInfo(updatedMedicalInfo);
      return updatedMedicalInfo;
    } catch (err) {
      console.error("Error updating medical info:", err);
      throw err;
    }
  };

  return {
    profile,
    medicalInfo,
    loading,
    error,
    updateProfile,
    updateMedicalInfo,
  };
}
