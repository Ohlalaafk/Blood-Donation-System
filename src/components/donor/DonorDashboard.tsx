import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Droplet, Heart, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAppointments } from "@/hooks/useAppointments";
import { useDonationHistory } from "@/hooks/useDonationHistory";
import { useDonorProfile } from "@/hooks/useDonorProfile";

interface DonationStats {
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  bloodType: string;
}

interface UpcomingAppointment {
  date: string;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface DonorDashboardProps {
  donorName?: string;
  stats?: DonationStats;
  upcomingAppointment?: UpcomingAppointment | null;
  onScheduleAppointment?: () => void;
  onViewHistory?: () => void;
  onViewProfile?: () => void;
  donorId?: string;
}

const DonorDashboard = ({
  donorName,
  stats: initialStats,
  upcomingAppointment: initialAppointment,
  onScheduleAppointment = () => {},
  onViewHistory = () => {},
  onViewProfile = () => {},
  donorId = "1", // Default donor ID for demo purposes
}: DonorDashboardProps) => {
  // Use the custom hooks to fetch real data
  const { profile, loading: profileLoading } = useDonorProfile(donorId);
  const { stats: donationStats, loading: historyLoading } =
    useDonationHistory(donorId);
  const { upcomingAppointment: nextAppointment, loading: appointmentLoading } =
    useAppointments(donorId);

  // Set up state with either provided props or data from hooks
  const [stats, setStats] = useState<DonationStats>(
    initialStats || {
      totalDonations: 0,
      lastDonation: new Date().toISOString().split("T")[0],
      nextEligible: new Date().toISOString().split("T")[0],
      bloodType: "Unknown",
    },
  );

  const [upcomingAppointment, setUpcomingAppointment] =
    useState<UpcomingAppointment | null>(initialAppointment || null);

  // Update state when data from hooks changes
  useEffect(() => {
    if (!profileLoading && profile) {
      // If we have a profile, use the name from it
      if (profile.name) {
        // Don't override if donorName was explicitly provided as a prop
        if (!donorName) {
          donorName = profile.name;
        }
      }

      // Update stats with profile data
      setStats((prev) => ({
        ...prev,
        bloodType: profile.blood_type || prev.bloodType,
        nextEligible: profile.next_eligible_date || prev.nextEligible,
      }));
    }

    if (!historyLoading && donationStats) {
      // Update stats with donation history data
      setStats((prev) => ({
        ...prev,
        totalDonations: donationStats.totalDonations || prev.totalDonations,
        lastDonation: donationStats.lastDonation?.date || prev.lastDonation,
      }));
    }

    if (!appointmentLoading && nextAppointment) {
      // Convert the appointment data to the format expected by the component
      setUpcomingAppointment({
        date: nextAppointment.date,
        time: nextAppointment.time,
        location: nextAppointment.location,
        status:
          nextAppointment.status === "scheduled"
            ? "confirmed"
            : nextAppointment.status === "cancelled"
              ? "cancelled"
              : "pending",
      });
    }
  }, [
    profileLoading,
    historyLoading,
    appointmentLoading,
    profile,
    donationStats,
    nextAppointment,
    donorName,
  ]);
  const isEligible = stats.nextEligible
    ? new Date(stats.nextEligible) <= new Date()
    : false;

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";

    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: "confirmed" | "pending" | "cancelled") => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {donorName || "Donor"}</h1>
        <Button variant="outline" onClick={onViewProfile}>
          <User className="mr-2 h-4 w-4" /> View Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Droplet className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Blood Type</h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.bloodType}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Total Donations</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalDonations}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Last Donation</h3>
              <p className="text-sm font-medium">
                {formatDate(stats.lastDonation)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Next Eligible</h3>
              <p className="text-sm font-medium">
                {formatDate(stats.nextEligible)}
              </p>
              <Badge
                className={`mt-2 ${isEligible ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {isEligible ? "Eligible Now" : "Not Eligible Yet"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {upcomingAppointment.location}
                    </h3>
                    <p className="text-gray-500">
                      {formatDate(upcomingAppointment.date)} at{" "}
                      {upcomingAppointment.time}
                    </p>
                  </div>
                  {getStatusBadge(upcomingAppointment.status)}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  {upcomingAppointment.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  You don't have any upcoming appointments
                </p>
                <Button onClick={onScheduleAppointment} disabled={!isEligible}>
                  Schedule Donation
                </Button>
                {!isEligible && (
                  <p className="text-sm text-amber-600 mt-2">
                    You'll be eligible to donate on{" "}
                    {formatDate(stats.nextEligible)}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={onScheduleAppointment}
                disabled={!isEligible}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Donation
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={onViewHistory}
              >
                <Clock className="mr-2 h-4 w-4" />
                View Donation History
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                Impact Dashboard
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Update Health Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorDashboard;
