import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertCircle, ArrowRight, DropletIcon } from "lucide-react";

interface BloodTypeData {
  type: string;
  units: number;
  capacity: number;
  status: "critical" | "low" | "normal" | "excess";
}

interface InventoryOverviewProps {
  bloodTypes?: BloodTypeData[];
  onViewDetails?: () => void;
  onRequestBlood?: (bloodType: string) => void;
}

// Status color mapping object instead of switch statements
const STATUS_COLORS = {
  critical: "bg-red-100 text-red-800 border-red-300",
  low: "bg-amber-100 text-amber-800 border-amber-300",
  normal: "bg-green-100 text-green-800 border-green-300",
  excess: "bg-blue-100 text-blue-800 border-blue-300",
} as const;

// Progress color mapping object
const PROGRESS_COLORS = {
  critical: "bg-red-500",
  low: "bg-amber-500",
  normal: "bg-green-500",
  excess: "bg-blue-500",
} as const;

// Default blood types data
const DEFAULT_BLOOD_TYPES: BloodTypeData[] = [
  { type: "A+", units: 45, capacity: 100, status: "normal" },
  { type: "A-", units: 12, capacity: 50, status: "low" },
  { type: "B+", units: 30, capacity: 80, status: "normal" },
  { type: "B-", units: 5, capacity: 40, status: "critical" },
  { type: "AB+", units: 15, capacity: 30, status: "normal" },
  { type: "AB-", units: 8, capacity: 20, status: "normal" },
  { type: "O+", units: 60, capacity: 120, status: "normal" },
  { type: "O-", units: 10, capacity: 60, status: "critical" },
];

// Blood type item component to reduce repetition
const BloodTypeItem = ({
  blood,
  onRequestBlood,
}: {
  blood: BloodTypeData;
  onRequestBlood: (type: string) => void;
}) => (
  <div
    key={blood.type}
    className="border rounded-lg p-3 flex flex-col space-y-2"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <DropletIcon className="h-5 w-5 text-red-600 mr-2" />
        <span className="font-semibold">{blood.type}</span>
      </div>
      <Badge
        variant="outline"
        className={
          STATUS_COLORS[blood.status] ||
          "bg-gray-100 text-gray-800 border-gray-300"
        }
      >
        {blood.status.charAt(0).toUpperCase() + blood.status.slice(1)}
      </Badge>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{blood.units} units</span>
        <span>{blood.capacity} capacity</span>
      </div>
      <Progress
        value={(blood.units / blood.capacity) * 100}
        className="h-2"
        indicatorClassName={PROGRESS_COLORS[blood.status] || "bg-gray-500"}
      />
    </div>
    {blood.status === "critical" && (
      <Button
        size="sm"
        variant="destructive"
        className="mt-2 w-full"
        onClick={() => onRequestBlood(blood.type)}
      >
        Request Blood
      </Button>
    )}
  </div>
);

const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  bloodTypes = DEFAULT_BLOOD_TYPES,
  onViewDetails = () => {},
  onRequestBlood = () => {},
}) => {
  // Use useMemo to avoid recalculating on every render
  const { criticalCount, lowCount } = useMemo(() => {
    return {
      criticalCount: bloodTypes.filter((blood) => blood.status === "critical")
        .length,
      lowCount: bloodTypes.filter((blood) => blood.status === "low").length,
    };
  }, [bloodTypes]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Blood Inventory Overview
        </CardTitle>
        <div className="flex items-center space-x-2">
          {criticalCount > 0 && (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 border-red-300"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              {criticalCount} Critical
            </Badge>
          )}
          {lowCount > 0 && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-300"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              {lowCount} Low
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodTypes.map((blood) => (
            <BloodTypeItem
              key={blood.type}
              blood={blood}
              onRequestBlood={onRequestBlood}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryOverview;
