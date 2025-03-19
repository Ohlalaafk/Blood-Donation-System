import { useState } from "react";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";
import InventoryOverview from "./dashboard/InventoryOverview";
import RequestsPanel from "./dashboard/RequestsPanel";

function Home() {
  const [activePage, setActivePage] = useState("dashboard");

  const handleRequestBlood = (bloodType: string) => {
    console.log(`Requesting blood type: ${bloodType}`);
    // Implementation would go here
  };

  const handleViewDetails = () => {
    console.log("View inventory details");
    setActivePage("inventory");
    // Implementation would go here
  };

  const handleApproveRequest = (id: string) => {
    console.log(`Approving request: ${id}`);
    // Implementation would go here
  };

  const handleRejectRequest = (id: string) => {
    console.log(`Rejecting request: ${id}`);
    // Implementation would go here
  };

  const handleViewRequestDetails = (id: string) => {
    console.log(`Viewing request details: ${id}`);
    // Implementation would go here
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar activePage={activePage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <InventoryOverview
              onRequestBlood={handleRequestBlood}
              onViewDetails={handleViewDetails}
            />
            <RequestsPanel
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onViewDetails={handleViewRequestDetails}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
