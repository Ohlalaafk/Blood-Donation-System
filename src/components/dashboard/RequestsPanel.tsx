import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Clock, X, AlertTriangle, ArrowRight } from "lucide-react";

type RequestStatus = "pending" | "approved" | "rejected" | "urgent";

interface BloodRequest {
  id: string;
  requestDate: string;
  hospital: string;
  bloodType: string;
  quantity: number;
  status: RequestStatus;
  priority: "low" | "medium" | "high";
}

interface RequestsPanelProps {
  requests?: BloodRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
        >
          <Check className="h-3 w-3" /> Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"
        >
          <X className="h-3 w-3" /> Rejected
        </Badge>
      );
    case "urgent":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-red-100 text-red-700 border-red-300"
        >
          <AlertTriangle className="h-3 w-3" /> Urgent
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Low
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 border-orange-200"
        >
          Medium
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          High
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const RequestsPanel = ({
  requests = [
    {
      id: "REQ-001",
      requestDate: "2023-06-15",
      hospital: "Central Hospital",
      bloodType: "O+",
      quantity: 3,
      status: "pending",
      priority: "high",
    },
    {
      id: "REQ-002",
      requestDate: "2023-06-14",
      hospital: "Memorial Medical Center",
      bloodType: "AB-",
      quantity: 1,
      status: "urgent",
      priority: "high",
    },
    {
      id: "REQ-003",
      requestDate: "2023-06-13",
      hospital: "St. Mary's Hospital",
      bloodType: "A+",
      quantity: 2,
      status: "approved",
      priority: "medium",
    },
    {
      id: "REQ-004",
      requestDate: "2023-06-12",
      hospital: "University Medical Center",
      bloodType: "B-",
      quantity: 1,
      status: "rejected",
      priority: "low",
    },
  ],
  onApprove = () => {},
  onReject = () => {},
  onViewDetails = () => {},
}: RequestsPanelProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Blood Requests
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[250px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Request ID</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.hospital}</TableCell>
                  <TableCell>{request.bloodType}</TableCell>
                  <TableCell>{request.quantity} units</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600"
                            onClick={() => onApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600"
                            onClick={() => onReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onViewDetails(request.id)}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsPanel;
