import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

interface DonationEvent {
  id: string;
  date: Date;
  time: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "donation" | "appointment" | "eligibility";
}

interface DonationCalendarProps {
  events?: DonationEvent[];
  onScheduleAppointment?: (date: Date) => void;
  onViewEvent?: (event: DonationEvent) => void;
}

const DonationCalendar = ({
  events = [
    {
      id: "1",
      date: new Date(2023, 6, 15),
      time: "10:00 AM",
      location: "Central Blood Bank",
      status: "scheduled",
      type: "appointment",
    },
    {
      id: "2",
      date: new Date(2023, 6, 5),
      time: "2:30 PM",
      location: "Mobile Donation Center",
      status: "completed",
      type: "donation",
    },
    {
      id: "3",
      date: new Date(2023, 7, 20),
      time: "",
      location: "",
      status: "scheduled",
      type: "eligibility",
    },
  ],
  onScheduleAppointment = () => {},
  onViewEvent = () => {},
}: DonationCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<DonationEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to check if a date has events
  const hasEvent = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    );
  };

  // Function to get events for a specific date
  const getEventsForDate = (day: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    );
  };

  // Function to handle day click
  const handleDayClick = (day: Date) => {
    setDate(day);
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
      setIsDialogOpen(true);
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: DonationEvent["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Completed
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

  // Function to get type badge
  const getTypeBadge = (type: DonationEvent["type"]) => {
    switch (type) {
      case "donation":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Donation
          </Badge>
        );
      case "appointment":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            Appointment
          </Badge>
        );
      case "eligibility":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Eligible Date
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Donation Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-5">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => day && handleDayClick(day)}
              className="rounded-md border"
              modifiers={{
                event: (day) => hasEvent(day),
              }}
              modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "0",
                },
              }}
            />
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Upcoming Events</h3>
              {events
                .filter((event) => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-md p-3 cursor-pointer hover:border-red-300 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDialogOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-red-600 mr-2" />
                        <span className="font-medium">
                          {format(event.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      {getTypeBadge(event.type)}
                    </div>
                    {event.type !== "eligibility" && (
                      <div className="space-y-1 text-sm text-gray-500">
                        {event.time && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => onScheduleAppointment(new Date())}
              >
                Schedule New Appointment
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>
                      {selectedEvent.type === "eligibility"
                        ? "Eligibility Date"
                        : selectedEvent.type === "donation"
                          ? "Blood Donation"
                          : "Appointment"}
                    </span>
                    <div className="flex space-x-2">
                      {getStatusBadge(selectedEvent.status)}
                      {getTypeBadge(selectedEvent.type)}
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span>{format(selectedEvent.date, "MMMM d, yyyy")}</span>
                  </div>

                  {selectedEvent.type !== "eligibility" && (
                    <>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-red-600 mr-2" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-red-600 mr-2" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </>
                  )}

                  {selectedEvent.type === "eligibility" ? (
                    <p className="text-gray-600">
                      You will be eligible to donate blood on this date. Would
                      you like to schedule an appointment?
                    </p>
                  ) : selectedEvent.status === "scheduled" ? (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onViewEvent(selectedEvent);
                          setIsDialogOpen(false);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onViewEvent(selectedEvent);
                          setIsDialogOpen(false);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DonationCalendar;
