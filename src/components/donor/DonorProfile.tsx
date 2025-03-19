import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, User, Shield, Heart, Calendar, Clock } from "lucide-react";

interface DonorInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  address: string;
  registrationDate: string;
  lastDonation: string;
  totalDonations: number;
  eligibilityStatus: "eligible" | "ineligible" | "pending";
  eligibilityReason?: string;
  nextEligibleDate?: string;
}

interface MedicalInfo {
  weight: number; // in kg
  height: number; // in cm
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  lastHealthCheck: string;
  hemoglobinLevel: number;
  bloodPressure: string;
  pulse: number;
}

interface DonorProfileProps {
  donorInfo?: DonorInfo;
  medicalInfo?: MedicalInfo;
  onEditProfile?: () => void;
  onEditMedical?: () => void;
  onScheduleDonation?: () => void;
}

const DonorProfile = ({
  donorInfo = {
    id: "DON-12345",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    bloodType: "O+",
    address: "123 Main St, Anytown, USA",
    registrationDate: "2020-03-10",
    lastDonation: "2023-05-15",
    totalDonations: 8,
    eligibilityStatus: "eligible",
    nextEligibleDate: "2023-08-15",
  },
  medicalInfo = {
    weight: 75,
    height: 180,
    allergies: ["Penicillin"],
    medications: ["None"],
    medicalConditions: ["None"],
    lastHealthCheck: "2023-05-15",
    hemoglobinLevel: 14.5,
    bloodPressure: "120/80",
    pulse: 72,
  },
  onEditProfile = () => {},
  onEditMedical = () => {},
  onScheduleDonation = () => {},
}: DonorProfileProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getEligibilityBadge = (status: DonorInfo["eligibilityStatus"]) => {
    switch (status) {
      case "eligible":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Eligible
          </Badge>
        );
      case "ineligible":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Not Eligible
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donor Profile</h1>
        <Button variant="outline" onClick={onEditProfile}>
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donorInfo.name}`}
                  alt="Donor avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{donorInfo.name}</h2>
              <div className="flex items-center justify-center mb-2">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-1">
                  <span className="text-red-600 font-bold text-xs">
                    {donorInfo.bloodType}
                  </span>
                </div>
                <span className="text-gray-500">Donor ID: {donorInfo.id}</span>
              </div>
              {getEligibilityBadge(donorInfo.eligibilityStatus)}

              <div className="mt-4 w-full">
                <Button
                  className="w-full"
                  onClick={onScheduleDonation}
                  disabled={donorInfo.eligibilityStatus !== "eligible"}
                >
                  Schedule Donation
                </Button>
                {donorInfo.eligibilityStatus !== "eligible" &&
                  donorInfo.nextEligibleDate && (
                    <p className="text-xs text-amber-600 mt-2">
                      Eligible from {formatDate(donorInfo.nextEligibleDate)}
                    </p>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" /> Personal Info
                </TabsTrigger>
                <TabsTrigger value="medical">
                  <Shield className="mr-2 h-4 w-4" /> Medical Info
                </TabsTrigger>
                <TabsTrigger value="donation">
                  <Heart className="mr-2 h-4 w-4" /> Donation History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p>{donorInfo.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Phone Number
                      </h3>
                      <p>{donorInfo.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </h3>
                      <p>{formatDate(donorInfo.dateOfBirth)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Blood Type
                      </h3>
                      <p>{donorInfo.bloodType}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <p>{donorInfo.address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Registration Date
                      </h3>
                      <p>{formatDate(donorInfo.registrationDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Donations
                      </h3>
                      <p>{donorInfo.totalDonations}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Health Information</h3>
                    <Button variant="outline" size="sm" onClick={onEditMedical}>
                      <Edit className="mr-2 h-3 w-3" /> Update
                    </Button>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Weight
                      </h3>
                      <p>{medicalInfo.weight} kg</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Height
                      </h3>
                      <p>{medicalInfo.height} cm</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Last Health Check
                      </h3>
                      <p>{formatDate(medicalInfo.lastHealthCheck)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Hemoglobin Level
                      </h3>
                      <p>{medicalInfo.hemoglobinLevel} g/dL</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Blood Pressure
                      </h3>
                      <p>{medicalInfo.bloodPressure} mmHg</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Pulse
                      </h3>
                      <p>{medicalInfo.pulse} bpm</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Allergies
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {medicalInfo.allergies.length > 0 ? (
                        medicalInfo.allergies.map((allergy, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-red-50"
                          >
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p>None reported</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Medications
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {medicalInfo.medications.length > 0 &&
                      medicalInfo.medications[0] !== "None" ? (
                        medicalInfo.medications.map((medication, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50"
                          >
                            {medication}
                          </Badge>
                        ))
                      ) : (
                        <p>None reported</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Medical Conditions
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {medicalInfo.medicalConditions.length > 0 &&
                      medicalInfo.medicalConditions[0] !== "None" ? (
                        medicalInfo.medicalConditions.map(
                          (condition, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-purple-50"
                            >
                              {condition}
                            </Badge>
                          ),
                        )
                      ) : (
                        <p>None reported</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="donation">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Recent Donations</h3>
                    <Button variant="outline" size="sm">
                      View All History
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-red-600 mr-2" />
                              {formatDate(donorInfo.lastDonation)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Central Blood Bank
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              Whole Blood
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Completed
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-red-600 mr-2" />
                              {formatDate(
                                new Date(
                                  new Date(donorInfo.lastDonation).getTime() -
                                    90 * 24 * 60 * 60 * 1000,
                                ).toISOString(),
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Memorial Hospital Drive
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              Whole Blood
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Completed
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-red-600 mr-2" />
                              {formatDate(
                                new Date(
                                  new Date(donorInfo.lastDonation).getTime() -
                                    180 * 24 * 60 * 60 * 1000,
                                ).toISOString(),
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Community Blood Drive
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                              Plasma
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Completed
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-red-600 mr-2" />
                      <div>
                        <h3 className="font-medium">Next Eligible Donation</h3>
                        <p className="text-sm text-gray-500">
                          {donorInfo.eligibilityStatus === "eligible"
                            ? "You are currently eligible to donate"
                            : donorInfo.nextEligibleDate
                              ? `You will be eligible on ${formatDate(
                                  donorInfo.nextEligibleDate,
                                )}`
                              : "Your eligibility is pending review"}
                        </p>
                      </div>
                    </div>
                    {donorInfo.eligibilityStatus === "eligible" && (
                      <Button onClick={onScheduleDonation}>Schedule Now</Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorProfile;
