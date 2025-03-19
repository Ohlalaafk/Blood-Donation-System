import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BloodTypeData {
  type: string;
  current: number;
  capacity: number;
  history: {
    date: string;
    value: number;
  }[];
}

interface BloodInventoryChartProps {
  bloodTypes?: BloodTypeData[];
  timeRange?: "week" | "month" | "quarter" | "year";
  onTimeRangeChange?: (range: "week" | "month" | "quarter" | "year") => void;
}

const BloodInventoryChart = ({
  bloodTypes = [
    {
      type: "A+",
      current: 45,
      capacity: 100,
      history: [
        { date: "2023-06-01", value: 30 },
        { date: "2023-06-08", value: 35 },
        { date: "2023-06-15", value: 40 },
        { date: "2023-06-22", value: 38 },
        { date: "2023-06-29", value: 45 },
      ],
    },
    {
      type: "B+",
      current: 30,
      capacity: 80,
      history: [
        { date: "2023-06-01", value: 25 },
        { date: "2023-06-08", value: 28 },
        { date: "2023-06-15", value: 32 },
        { date: "2023-06-22", value: 35 },
        { date: "2023-06-29", value: 30 },
      ],
    },
    {
      type: "AB+",
      current: 15,
      capacity: 30,
      history: [
        { date: "2023-06-01", value: 10 },
        { date: "2023-06-08", value: 12 },
        { date: "2023-06-15", value: 15 },
        { date: "2023-06-22", value: 18 },
        { date: "2023-06-29", value: 15 },
      ],
    },
    {
      type: "O+",
      current: 60,
      capacity: 120,
      history: [
        { date: "2023-06-01", value: 50 },
        { date: "2023-06-08", value: 55 },
        { date: "2023-06-15", value: 58 },
        { date: "2023-06-22", value: 62 },
        { date: "2023-06-29", value: 60 },
      ],
    },
    {
      type: "A-",
      current: 12,
      capacity: 50,
      history: [
        { date: "2023-06-01", value: 15 },
        { date: "2023-06-08", value: 14 },
        { date: "2023-06-15", value: 13 },
        { date: "2023-06-22", value: 10 },
        { date: "2023-06-29", value: 12 },
      ],
    },
    {
      type: "B-",
      current: 5,
      capacity: 40,
      history: [
        { date: "2023-06-01", value: 8 },
        { date: "2023-06-08", value: 7 },
        { date: "2023-06-15", value: 6 },
        { date: "2023-06-22", value: 4 },
        { date: "2023-06-29", value: 5 },
      ],
    },
    {
      type: "AB-",
      current: 8,
      capacity: 20,
      history: [
        { date: "2023-06-01", value: 5 },
        { date: "2023-06-08", value: 6 },
        { date: "2023-06-15", value: 7 },
        { date: "2023-06-22", value: 8 },
        { date: "2023-06-29", value: 8 },
      ],
    },
    {
      type: "O-",
      current: 10,
      capacity: 60,
      history: [
        { date: "2023-06-01", value: 18 },
        { date: "2023-06-08", value: 15 },
        { date: "2023-06-15", value: 12 },
        { date: "2023-06-22", value: 8 },
        { date: "2023-06-29", value: 10 },
      ],
    },
  ],
  timeRange = "month",
  onTimeRangeChange = () => {},
}: BloodInventoryChartProps) => {
  // This would be replaced with a real chart library in a production app
  // For this example, we'll create a simple visual representation

  const getStatusColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 20) return "bg-red-500";
    if (percentage < 40) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Blood Inventory Trends
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRange}
            onValueChange={(value) =>
              onTimeRangeChange(value as "week" | "month" | "quarter" | "year")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="space-y-6">
              {bloodTypes.map((bloodType) => (
                <div key={bloodType.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: bloodType.type.includes("-")
                            ? "#ef4444"
                            : "#3b82f6",
                        }}
                      ></div>
                      <span className="font-medium">{bloodType.type}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {bloodType.current} / {bloodType.capacity} units
                    </span>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-md overflow-hidden flex">
                    {bloodType.history.map((point, index) => {
                      const percentage =
                        (point.value / bloodType.capacity) * 100;
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col justify-end relative group"
                        >
                          <div
                            className={`${getStatusColor(
                              point.value,
                              bloodType.capacity,
                            )} transition-all duration-300`}
                            style={{ height: `${percentage}%` }}
                          ></div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mb-1">
                            {point.value} units
                            <br />
                            {new Date(point.date).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Blood Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Current
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bloodTypes.map((bloodType) => {
                    const percentage =
                      (bloodType.current / bloodType.capacity) * 100;
                    let status = "Normal";
                    let statusClass = "text-green-600";

                    if (percentage < 20) {
                      status = "Critical";
                      statusClass = "text-red-600";
                    } else if (percentage < 40) {
                      status = "Low";
                      statusClass = "text-amber-600";
                    }

                    // Calculate trend (simple comparison of first and last points)
                    const firstPoint = bloodType.history[0].value;
                    const lastPoint =
                      bloodType.history[bloodType.history.length - 1].value;
                    const trend = lastPoint - firstPoint;
                    const trendIcon = trend > 0 ? "↑" : trend < 0 ? "↓" : "→";
                    const trendClass =
                      trend > 0
                        ? "text-green-600"
                        : trend < 0
                          ? "text-red-600"
                          : "text-gray-600";

                    return (
                      <tr key={bloodType.type}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: bloodType.type.includes("-")
                                  ? "#ef4444"
                                  : "#3b82f6",
                              }}
                            ></div>
                            <div className="font-medium">{bloodType.type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bloodType.current} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bloodType.capacity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${trendClass}`}>
                            {trendIcon} {Math.abs(trend)} units
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BloodInventoryChart;
