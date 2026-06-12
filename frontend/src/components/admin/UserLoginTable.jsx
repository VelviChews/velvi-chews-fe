import React from "react";
import { MoreHorizontal } from "lucide-react";

const UserLoginTable = ({ data = [], search, setSearch }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">User Login Monitoring</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50">
            Filters 
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Email Address</th>
              <th className="px-6 py-3">Last Login Date & Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent logins</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.user_name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.email_address}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(row.last_login_date).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLoginTable;
