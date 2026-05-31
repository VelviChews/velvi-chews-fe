import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

const PAGE_LABELS = {
  "/home": "Home",
  "/membership": "Membership",
  "/redeem": "Redeem",
  "/history": "History",
  "/profile": "Profile",
  "/profile/account-info": "Account Info",
  "/profile/add-item": "Add Item",
  "/login": "Login",
  "/": "Login",
};

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-[#FF89AC]">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm font-semibold text-gray-600 mb-3">{label}</p>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-28 text-xs text-gray-500 truncate shrink-0">{d.name}</span>
            <div className="flex-1 bg-[#FCAFC1]/20 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-[#FF89AC]"
                style={{ width: `${(d.count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function count(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] || "Unknown";
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(obj) {
  return Object.entries(obj)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export default function AnalyticsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const load = () =>
      fetch(`${API}/analytics`)
        .then((r) => r.json())
        .then((d) => { setEvents(d); setLoading(false); })
        .catch(() => setLoading(false));
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const pageVisits = events.filter((e) => !e.eventType);
  const exits = events.filter((e) => e.eventType === "page_exit");

  // Stats
  const totalVisits = pageVisits.length;
  const uniqueUsers = new Set(pageVisits.map((e) => e.username)).size;
  const uniquePages = new Set(pageVisits.map((e) => e.page)).size;
  const avgDuration =
    exits.length > 0
      ? Math.round(exits.reduce((s, e) => s + (e.durationSeconds || 0), 0) / exits.length)
      : 0;

  // Chart data
  const pageData = toChartData(count(pageVisits, "page")).map((d) => ({
    ...d,
    name: PAGE_LABELS[d.name] || d.name,
  }));
  const userPageData = toChartData(count(pageVisits, "username")).slice(0, 10);
  const deviceData = toChartData(count(pageVisits, "deviceType"));
  const browserData = toChartData(count(pageVisits, "browser"));
  const hourData = Array.from({ length: 24 }, (_, h) => ({
    name: `${h}:00`,
    count: pageVisits.filter((e) => e.hour === h).length,
  })).filter((d) => d.count > 0);
  const dayData = toChartData(count(pageVisits, "dayOfWeek"));
  const connectionData = toChartData(count(pageVisits, "connectionType"));

  // Recent visitors table
  const recent = [...pageVisits].reverse().slice(0, 20);

  const handleClear = () => {
    if (!confirm("Hapus semua data analytics?")) return;
    fetch(`${API}/analytics`, { method: "DELETE" }).then(() => setEvents([]));
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-[#FF89AC]">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F8] pb-10">
      {/* Header */}
      <div className="bg-[#FF89AC] px-4 py-5 text-white">
        <h1 className="text-xl font-bold">Visitor Analytics</h1>
        <p className="text-xs opacity-80">Velvi Chews — Internal Dashboard</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white px-4 py-2 shadow-sm sticky top-0 z-10">
        {["overview", "pages", "users", "device", "recent"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
              tab === t ? "bg-[#FF89AC] text-white" : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Page Views" value={totalVisits} />
              <StatCard label="Unique Users" value={uniqueUsers} />
              <StatCard label="Pages Visited" value={uniquePages} />
              <StatCard label="Avg Time on Page" value={`${avgDuration}s`} />
            </div>
            <BarChart data={pageData} label="Most Visited Pages" />
            <BarChart data={hourData} label="Visits by Hour" />
            <BarChart data={dayData} label="Visits by Day" />
          </>
        )}

        {tab === "pages" && (
          <>
            <BarChart data={pageData} label="Page Views" />
            {/* Avg duration per page */}
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-semibold text-gray-600 mb-3">Avg Duration per Page (seconds)</p>
              {pageData.map((d) => {
                const rawPage = Object.keys(PAGE_LABELS).find((k) => PAGE_LABELS[k] === d.name) || d.name;
                const pageExits = exits.filter((e) => e.page === rawPage);
                const avg = pageExits.length
                  ? Math.round(pageExits.reduce((s, e) => s + (e.durationSeconds || 0), 0) / pageExits.length)
                  : 0;
                return (
                  <div key={d.name} className="flex justify-between text-xs py-1 border-b border-gray-50">
                    <span className="text-gray-600">{d.name}</span>
                    <span className="font-semibold text-[#FF89AC]">{avg}s</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <BarChart data={userPageData} label="Most Active Users" />
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-semibold text-gray-600 mb-3">User Details</p>
              {userPageData.map((u) => {
                const userEvents = pageVisits.filter((e) => e.username === u.name);
                const lastSeen = userEvents[userEvents.length - 1]?.entryTime;
                const pages = [...new Set(userEvents.map((e) => PAGE_LABELS[e.page] || e.page))];
                return (
                  <div key={u.name} className="py-2 border-b border-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">{u.name}</span>
                      <span className="text-xs text-[#FF89AC]">{u.count} views</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Last seen: {lastSeen ? new Date(lastSeen).toLocaleString("id-ID") : "-"}
                    </p>
                    <p className="text-xs text-gray-400">Pages: {pages.join(", ")}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "device" && (
          <>
            <BarChart data={deviceData} label="Device Type" />
            <BarChart data={browserData} label="Browser" />
            <BarChart data={connectionData} label="Connection Type" />
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-semibold text-gray-600 mb-3">Screen Resolutions</p>
              {toChartData(
                count(
                  pageVisits.map((e) => ({
                    ...e,
                    resolution: e.screenWidth ? `${e.screenWidth}×${e.screenHeight}` : "Unknown",
                  })),
                  "resolution"
                )
              )
                .slice(0, 8)
                .map((d) => (
                  <div key={d.name} className="flex justify-between text-xs py-1 border-b border-gray-50">
                    <span className="text-gray-600">{d.name}</span>
                    <span className="font-semibold text-[#FF89AC]">{d.count}</span>
                  </div>
                ))}
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-semibold text-gray-600 mb-3">Languages</p>
              {toChartData(count(pageVisits, "language")).slice(0, 8).map((d) => (
                <div key={d.name} className="flex justify-between text-xs py-1 border-b border-gray-50">
                  <span className="text-gray-600">{d.name}</span>
                  <span className="font-semibold text-[#FF89AC]">{d.count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "recent" && (
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm font-semibold text-gray-600 mb-3">Recent Visits (last 20)</p>
            {recent.map((e, i) => (
              <div key={i} className="py-2 border-b border-gray-50">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">{e.username}</span>
                  <span className="text-xs text-[#FF89AC]">{PAGE_LABELS[e.page] || e.page}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {e.entryTime ? new Date(e.entryTime).toLocaleString("id-ID") : "-"} · {e.deviceType} · {e.browser}
                </p>
                {e.referrer && <p className="text-xs text-gray-300 truncate">ref: {e.referrer}</p>}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleClear}
          className="w-full rounded-xl border border-red-200 py-2 text-xs text-red-400 hover:bg-red-50"
        >
          Reset Analytics Data
        </button>
      </div>
    </div>
  );
}
