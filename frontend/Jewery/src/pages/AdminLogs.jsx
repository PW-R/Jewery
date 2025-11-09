import React, { useEffect, useState } from "react";
import { getAllClicks } from "../api/clickApi.js";
import { getUsers } from "../api/userApi.js";
import { getProducts } from "../api/productApi.js";
import { format } from "date-fns";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Fetch all clicks
      const clicksRes = await getAllClicks();
      const clicksData = clicksRes?.data || [];

      // 2️⃣ Fetch all users
      const usersRes = await getUsers();
      const usersData = usersRes?.data || [];
      const usersLookup = {};
      usersData.forEach((u) => {
        usersLookup[u._id] = u;
      });

      // 3️⃣ Fetch all products
      const productsRes = await getProducts();
      const productsData = productsRes?.data || [];
      const productsLookup = {};
      productsData.forEach((p) => {
        productsLookup[p._id] = p;
      });

      setUsersMap(usersLookup);
      setProductsMap(productsLookup);

      // 4️⃣ Sort logs by lastViewed descending
      const sortedLogs = clicksData.sort(
        (a, b) => new Date(b.lastViewed) - new Date(a.lastViewed)
      );

      setLogs(sortedLogs);
    } catch (err) {
      console.error("Error loading admin logs:", err);
      setError("Failed to load logs. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs =
    filterType === "all" ? logs : logs.filter((item) => item.type === filterType);

  return (
    <div className="min-h-screen bg-[#FBE8E8] text-[#915858] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-3 md:mb-0">
          Admin Analytics Logs
        </h2>
        {/* Filter Buttons */}
        <div className="flex gap-3">
          {["all", "history", "product"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-xl capitalize transition-all ${
                filterType === type
                  ? "bg-[#915858] text-white"
                  : "bg-white border border-[#915858] hover:bg-[#f8dada]"
              }`}
              onClick={() => setFilterType(type)}
            >
              {type === "all"
                ? "All"
                : type === "history"
                ? "User History"
                : "Product Clicks"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-2xl p-4">
        {loading ? (
          <div className="text-center text-[#915858] py-6">Loading click data...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-[#915858] py-6">No click logs found.</div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#FBE8E8] text-left text-[#915858] border-b border-[#f0caca]">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-center">Click Count</th>
                <th className="px-4 py-2">Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((item, index) => {
                // Handle ObjectId vs string
                const userIdKey = item.userId?._id || item.userId;
                const productIdKey = item.productId?._id || item.productId;

                const user = userIdKey ? usersMap[userIdKey] : null;
                const product = productIdKey ? productsMap[productIdKey] : null;

                return (
                  <tr
                    key={item._id || index}
                    className="hover:bg-[#fdf4f4] border-b border-[#f5dcdc]"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {user
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                          user.email
                        : "Anonymous"}
                    </td>
                    <td className="px-4 py-2">{product?.name || "Unknown Product"}</td>
                    <td className="px-4 py-2">{product?.category || "—"}</td>
                    <td className="px-4 py-2 capitalize">{item.type || "N/A"}</td>
                    <td className="px-4 py-2 text-center">{item.clickCount ?? 0}</td>
                    <td className="px-4 py-2">
                      {item.lastViewed
                        ? format(new Date(item.lastViewed), "yyyy-MM-dd HH:mm")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
