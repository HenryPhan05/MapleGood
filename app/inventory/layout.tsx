import DashboardSidebar from "../components/DashboardSidebar";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="min-h-screen flex-1 overflow-x-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
}
