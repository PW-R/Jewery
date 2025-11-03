import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#fffaf9]">
      {/* Sidebar ฝั่งแอดมิน */}
      <AdminNavbar />

      {/* เนื้อหาที่เปลี่ยนตามหน้า */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
