import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Bell, Calendar, Check, Clock, Droplet, Settings, Trash2 } from "lucide-react";

type NotificationType = "appointment" | "inventory" | "request" | "eligibility" | "system";
type NotificationPriority = "low" | "medium" | "high" | "urgent";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationPanelProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  onAction?: (notification: Notification) => void;
}

const NotificationPanel = ({
  notifications = [
    {
      id: "n1",
      title: "Low Inventory Alert",
      message: "O- blood type is at critical level (2 units)",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      type: "inventory",
      priority: "urgent",
      actionUrl: "/inventory",
      actionLabel: "View Inventory",
    },
    {
      id: "n2",
      title: "Appointment Reminder",
      message: "Your donation appointment is tomorrow at 10:00 AM",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      type: "appointment",
      priority: "high",
      actionUrl: "/appointments",
      actionLabel: "