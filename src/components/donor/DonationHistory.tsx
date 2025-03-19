import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Download, FileText, Filter, Search } from "lucide-react";

interface DonationRecord {
  id: string;
  date: string;
  location: string;
  donationType: "whole blood" | "plasma" | "platelets" | "double red cells";
  status: "completed" | "deferred" | "cancelled";
  hemoglobin: number;
  volume: number;
  notes?: string;
}

interface DonationHistoryProps {
  donations?: DonationRecord[];
  onExportHistory?: () => void;
  onViewDetails?: (donation: DonationRecord) => void;
}

const DonationHistory = ({
  donations = [
    {
      id: "DON-001",
      date: "2023-05-15",
      location: "Central Blood Bank",
      donationType: "whole blood",
      status: "completed",
      hemoglobin: 14.2,
      volume: 450,
      notes: "Successful donation, no adverse reactions.",
    },
    {
      id: "DON-002",
      date: "2023-02-10",
      location: "Memorial Hospital Drive",
      donationType: "whole blood",
      status: "completed",
      hemoglobin: 13.8,
      volume: 450,
    },
    {
      id: "DON-003",
      date: "2022-11-05",
      location: "Community Blood Drive",
      donationType: "plasma",
      status: "completed",
      hemoglobin: 14.0,
      volume: 600,
    },
    {
      id: "DON-004",
      date: "2022-08-20",
      location: "Central Blood Bank",
      donationType: "whole blood",
      status: "completed",
      hemoglobin: 13.5,
      volume: 450,
    },
    {
      id: "DON-005",
      date: "2022-05-12",
      location: "University Medical Center",
      donationType: "platelets",
      status: "completed",
      hemoglobin: 14.5,
      volume: 200,
    },
    {
      id: "DON-006",
      date: "2022-02-03",
      location: "Central Blood Bank",
      donationType: "whole blood",
      status: "deferred",
      hemoglobin: 12.2,
      volume: 0,
      notes: "Deferred due to low hemoglobin levels.",
    },
    {
      id: "DON-007",
      date: "2021-11-15",
      location: "Mobile Donation Center",
      donationType: "whole blood",
      status: "completed",
      hemoglobin: 14.8,
      volume: 450,
    },
    {
      id: "DON-008",
      date: "2021-08-07",
      location: "Central Blood Bank",
      donationType: "double red cells",
      status: "completed",
      hemoglobin: 15.2,
      volume: 360,
    },
  ],
  onExportHistory = () => {},
  onViewDetails = () => {},
}: DonationHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDonation, setSelectedDonation] =
    useState<DonationRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: DonationRecord["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        );
      case "deferred":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            Deferred
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

  const getTypeBadge = (type: DonationRecord["donationType"]) => {
    switch (type) {
      case "whole blood":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Whole Blood
          </Badge>
        );
      case "plasma":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Plasma
          </Badge>
        );
      case "platelets":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            Platelets
          </Badge>
        );
      case "double red cells":
        return (
          <Badge className="bg-pink-100 text-pink-800 border-pink-300">
            Double Red Cells
          </Badge>
        );
    }
  };

  // Filter donations based on search term and filters
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || donation.donationType === typeFilter;

    const matchesStatus =
      statusFilter === "all" || donation.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const totalDonations = donations.filter(
    (d) => d.status === "completed",
  ).length;
  const totalVolume = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.volume, 0);
  const lastDonation = donations.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-xl font-bold">Donation History</CardTitle>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={onExportHistory}
          >
            <Download className="mr-2 h-4 w-4" /> Export History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Total Donations</h3>
                <p className="text-3xl font-bold text-red-600">
                  {totalDonations}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Total Volume</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {totalVolume} mL
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Last Donation</h3>
                <p className="text-sm font-medium">
                  {formatDate(lastDonation.date)}
                </p>
                <div className="mt-1">
                  {getTypeBadge(lastDonation.donationType)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by location or ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Donation Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whole blood">Whole Blood</SelectItem>
                <SelectItem value="plasma">Plasma</SelectItem>
                <SelectItem value="platelets">Platelets</SelectItem>
                <SelectItem value="double red cells">
                  Double Red Cells
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="deferred">Deferred</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Hemoglobin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-red-600 mr-2" />
                        {formatDate(donation.date)}
                      </div>
                    </TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell>{getTypeBadge(donation.donationType)}</TableCell>
                    <TableCell>
                      {donation.status === "completed"
                        ? `${donation.volume} mL`
                        : "-"}
                    </TableCell>
                    <TableCell>{donation.hemoglobin} g/dL</TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No donations found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            {selectedDonation && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Donation Details</span>
                    <div className="flex space-x-2">
                      {getStatusBadge(selectedDonation.status)}
                      {getTypeBadge(selectedDonation.donationType)}
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Donation ID
                      </h3>
                      <p>{selectedDonation.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Date
                      </h3>
                      <p>{formatDate(selectedDonation.date)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Location
                      </h3>
                      <p>{selectedDonation.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Donation Type
                      </h3>
                      <p className="capitalize">
                        {selectedDonation.donationType}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Volume
                      </h3>
                      <p>
                        {selectedDonation.status === "completed"
                          ? `${selectedDonation.volume} mL`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Hemoglobin Level
                      </h3>
                      <p>{selectedDonation.hemoglobin} g/dL</p>
                    </div>
                  </div>

                  {selectedDonation.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Notes
                      </h3>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedDonation.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onViewDetails(selectedDonation);
                        setIsDialogOpen(false);
                      }}
                    >
                      Print Certificate
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DonationHistory;
