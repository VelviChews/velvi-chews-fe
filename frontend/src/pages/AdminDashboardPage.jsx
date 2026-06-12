import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
  LogOut
} from "lucide-react";
import StatCard from "../components/admin/StatCard";
import UserLoginTable from "../components/admin/UserLoginTable";
import QRCodeUsageTable from "../components/admin/QRCodeUsageTable";
import { DashboardCharts } from "../components/admin/DashboardCharts";
import { LiveActiveUsersChart } from "../components/admin/LiveActiveUsersChart";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
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

  // UI State
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      const searchParamLogins = globalSearch || loginSearch;
      const searchParamQr = globalSearch; 

      const [statsRes, loginsRes, qrScansRes, chartRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard/stats`, { headers }),
        fetch(`${API_URL}/admin/dashboard/logins?search=${searchParamLogins}`, { headers }),
        fetch(`${API_URL}/admin/dashboard/qr-scans?search=${searchParamQr}&date=${qrDateFilter}`, { headers }),
        fetch(`${API_URL}/admin/dashboard/chart-data?period=${chartPeriod.toLowerCase()}`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (loginsRes.ok) {
         const loginsData = await loginsRes.json();
         setLogins(loginsData.data || []);
      }
      if (qrScansRes.ok) {
         const scansData = await qrScansRes.json();
         setQrScans(scansData.data || []);
      }
      if (chartRes.ok) setChartData(await chartRes.json());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalSearch, loginSearch, qrDateFilter, chartPeriod]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGenerateReport = () => {
    // Basic CSV Generation
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Report Date," + new Date().toLocaleDateString() + "\\n\\n";
    csvContent += "Metric,Value\\n";
    csvContent += `Total Users,${stats.total_users}\\n`;
    csvContent += `Total Logged-in Users,${stats.active_users}\\n`;
    csvContent += `Total QR Scans,${stats.total_qr_scans}\\n`;
    csvContent += `Total Unique Scanners,${stats.unique_qr_scanners}\\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Activity', icon: Activity },
    { name: 'QR Scans', icon: QrCode },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <HelpCircle className="w-5 h-5" /> Support
          </button>
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
            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-gray-50"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  A
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <div className="p-2 border-b">
                    <p className="text-sm font-semibold text-gray-800">admin@velvichews.com</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{activeTab === 'Dashboard' ? 'User Activity Dashboard' : activeTab}</h1>
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
                {/* Stats Row - Only show on Dashboard or Activity */}
                {(activeTab === 'Dashboard' || activeTab === 'Activity') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 animate-fade-in">
                    <StatCard title="Total Registered Users" value={stats.total_users.toLocaleString()} percentage="1.2" isPositive={true} sparklineData={[20,30,25,40,60,50,70]} />
                    <StatCard title="Total Logged-in Users" value={stats.active_users.toLocaleString()} percentage="3.5" isPositive={true} sparklineData={[10,20,30,40,50,45,60]} />
                    <StatCard title="Total QR Code Scans" value={stats.total_qr_scans.toLocaleString()} percentage="2.8" isPositive={true} sparklineData={[30,40,35,50,60,80,90]} />
                    <StatCard title="Total Unique Scanners" value={stats.unique_qr_scanners.toLocaleString()} percentage="1.9" isPositive={true} />
                    <StatCard title="Today's Logins" value={stats.todays_logins.toLocaleString()} percentage="0.8" isPositive={true} sparklineData={[5,10,15,10,20,25,30]} />
                    <StatCard title="Today's QR Scans" value={stats.todays_qr_scans.toLocaleString()} percentage="1.4" isPositive={true} sparklineData={[10,15,20,25,30,40,50]} />
                  </div>
                )}

                {/* Main Content Areas */}
                {activeTab === 'Dashboard' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
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
                )}

                {activeTab === 'Users' && (
                  <div className="w-full animate-fade-in">
                    <UserLoginTable data={logins} search={loginSearch} setSearch={setLoginSearch} />
                  </div>
                )}

                {activeTab === 'Activity' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <DashboardCharts data={chartData} filter={chartPeriod} setFilter={setChartPeriod} />
                    <LiveActiveUsersChart data={chartData} totalActive={stats.active_users} />
                  </div>
                )}

                {activeTab === 'QR Scans' && (
                  <div className="w-full animate-fade-in">
                    <QRCodeUsageTable data={qrScans} dateFilter={qrDateFilter} setDateFilter={setQrDateFilter} />
                  </div>
                )}

                {(activeTab === 'Reports' || activeTab === 'Settings') && (
                  <div className="bg-white rounded-lg border shadow-sm p-10 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'Reports' ? <FileText className="w-8 h-8 text-gray-400" /> : <Settings className="w-8 h-8 text-gray-400" />}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{activeTab} Module</h3>
                    <p className="text-gray-500">This module is currently under development.</p>
                  </div>
                )}
             </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
