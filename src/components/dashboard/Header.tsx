import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
}

const Header = ({
  userName = "Dr. Sarah Johnson",
  userRole = "Hospital Administrator",
  notificationCount = 5,
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">B+</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Blood Bank Management System
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <div className="font-medium">Low Inventory Alert</div>
                <div className="text-sm text-gray-500">
                  O- blood type is at critical level (2 units)
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <div className="font-medium">New Request</div>
                <div className="text-sm text-gray-500">
                  Memorial Hospital requested 3 units of A+
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <div className="font-medium">Delivery Scheduled</div>
                <div className="text-sm text-gray-500">
                  Blood delivery arriving at 2:30 PM today
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <div className="font-medium">Request Approved</div>
                <div className="text-sm text-gray-500">
                  Your request for B+ units has been approved
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <div className="font-medium">Donor Registration</div>
                <div className="text-sm text-gray-500">
                  5 new donors registered today
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                  alt={userName}
                />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
