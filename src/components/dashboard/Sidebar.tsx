import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Droplet,
  FileText,
  Users,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  className?: string;
  activePage?: string;
}

const Sidebar = ({ className, activePage = "dashboard" }: SidebarProps) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Droplet size={20} />,
      path: "/inventory",
    },
    {
      id: "requests",
      label: "Requests",
      icon: <FileText size={20} />,
      path: "/requests",
    },
    {
      id: "donors",
      label: "Donors",
      icon: <Users size={20} />,
      path: "/donors",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[280px] bg-white border-r border-gray-200 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-center mb-8 mt-2">
        <div className="flex items-center">
          <Droplet className="h-8 w-8 text-red-600 mr-2" />
          <h2 className="text-xl font-bold">BloodBank</h2>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  activePage === item.id
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.id === "inventory" && (
                  <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                    3 Low
                  </span>
                )}
                {item.id === "requests" && (
                  <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                    5 New
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">Dr. John Smith</p>
            <p className="text-xs text-gray-500">Blood Bank Admin</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
