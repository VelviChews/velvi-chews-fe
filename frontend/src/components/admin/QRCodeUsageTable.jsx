import React from "react";
import { MoreHorizontal } from "lucide-react";

const QRCodeUsageTable = ({ data = [], dateFilter, setDateFilter }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">QR Code Usage Monitoring</h2>
        <div className="flex gap-2">
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              <th className="px-6 py-3">QR Code Scanned</th>
              <th className="px-6 py-3">Scan Date & Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent scans</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.user_name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.qr_code_scanned}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(row.scan_date).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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

export default QRCodeUsageTable;
