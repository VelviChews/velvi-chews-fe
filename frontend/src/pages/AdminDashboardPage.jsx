import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  QrCode, 
  FileText, 
  Settings, 
  HelpCircle,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import StatCard from "../components/admin/StatCard";
import UserLoginTable from "../components/admin/UserLoginTable";
import QRCodeUsageTable from "../components/admin/QRCodeUsageTable";
import { DashboardCharts } from "../components/admin/DashboardCharts";
import { LiveActiveUsersChart } from "../components/admin/LiveActiveUsersChart";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_qr_scans: 0,
    unique_qr_scanners: 0,
    todays_logins: 0,
    todays_qr_scans: 0
  });
  
  const [logins, setLogins] = useState([]);
  const [qrScans, setQrScans] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('Daily');
  const [isLoading, setIsLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Table specific filters
  const [loginSearch, setLoginSearch] = useState('');
  const [qrDateFilter, setQrDateFilter] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      // if global search is used, use it. otherwise use specific filters
      const searchParamLogins = globalSearch || loginSearch;
      const searchParamQr = globalSearch; 

      const [statsRes, loginsRes, qrScansRes, chartRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard/stats`, { headers }),
        fetch(`${API_URL}/admin/dashboard/logins?search=${searchParamLogins}`, { headers }),
        // For QR scans, pass both search and date filters (if API supports date, otherwise filter frontend)
        fetch(`${API_URL}/admin/dashboard/qr-scans?search=${searchParamQr}&date=${qrDateFilter}`, { headers }),
        fetch(`${API_URL}/admin/dashboard/chart-data?period=${chartPeriod.toLowerCase()}`, { headers })
      ]);

      if (statsRes.ok) {
         setStats(await statsRes.json());
      }
      if (loginsRes.ok) {
         const loginsData = await loginsRes.json();
         setLogins(loginsData.data || []);
      }
      if (qrScansRes.ok) {
         const scansData = await qrScansRes.json();
         setQrScans(scansData.data || []);
      }
      if (chartRes.ok) {
         setChartData(await chartRes.json());
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalSearch, loginSearch, qrDateFilter, chartPeriod]);

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-gray-800">Activity Monitor</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link to="#" className="flex items-center gap-3 px-3 py-2 bg-indigo-600 text-white rounded-md">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Users className="w-5 h-5" /> Users
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Activity className="w-5 h-5" /> Activity
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <QrCode className="w-5 h-5" /> QR Scans
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <FileText className="w-5 h-5" /> Reports
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <HelpCircle className="w-5 h-5" /> Support
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Users, Activity, Scans..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 w-full text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600" onClick={fetchData}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                A
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => alert("Generate Report Logic Here!")}
            >
              Generate Report
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Activity Dashboard</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          {isLoading ? (
             <div className="w-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             </div>
          ) : (
             <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <StatCard title="Total Registered Users" value={stats.total_users.toLocaleString()} percentage="1.2" isPositive={true} sparklineData={[20,30,25,40,60,50,70]} />
                  <StatCard title="Total Logged-in Users" value={stats.active_users.toLocaleString()} percentage="3.5" isPositive={true} sparklineData={[10,20,30,40,50,45,60]} />
                  <StatCard title="Total QR Code Scans" value={stats.total_qr_scans.toLocaleString()} percentage="2.8" isPositive={true} sparklineData={[30,40,35,50,60,80,90]} />
                  <StatCard title="Total Unique Scanners" value={stats.unique_qr_scanners.toLocaleString()} percentage="1.9" isPositive={true} />
                  <StatCard title="Today's Logins" value={stats.todays_logins.toLocaleString()} percentage="0.8" isPositive={true} sparklineData={[5,10,15,10,20,25,30]} />
                  <StatCard title="Today's QR Scans" value={stats.todays_qr_scans.toLocaleString()} percentage="1.4" isPositive={true} sparklineData={[10,15,20,25,30,40,50]} />
                </div>

                {/* Tables and Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <UserLoginTable data={logins} search={loginSearch} setSearch={setLoginSearch} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DashboardCharts data={chartData} filter={chartPeriod} setFilter={setChartPeriod} />
                      <LiveActiveUsersChart data={chartData} totalActive={stats.active_users} />
                    </div>
                  </div>
                  <div>
                    <QRCodeUsageTable data={qrScans} dateFilter={qrDateFilter} setDateFilter={setQrDateFilter} />
                  </div>
                </div>
             </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
