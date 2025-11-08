import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ setIsLoggedIn }) {
  return (
    <div className="flex min-h-screen bg-[#fffaf9]">
      {/* Sidebar ฝั่งแอดมิน */}
      <AdminNavbar setIsLoggedIn={setIsLoggedIn} />

      {/* เนื้อหาที่เปลี่ยนตามหน้า */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Pass setIsLoggedIn to nested routes */}
        <Outlet context={{ setIsLoggedIn }} />
      </main>
    </div>
  );
}

export default AdminLayout;
