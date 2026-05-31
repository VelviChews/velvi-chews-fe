import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:3001";

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  return {
    userAgent: ua,
    deviceType: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    connectionType: navigator.connection?.effectiveType ?? null,
    connectionDownlink: navigator.connection?.downlink ?? null,
    touchSupport: navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints,
  };
}

function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";
  return { browser, userAgent: ua };
}

export function useTracker(username) {
  const location = useLocation();
  const entryTimeRef = useRef(null);
  const prevPageRef = useRef(null);
  const user = username || "anonymous";

  useEffect(() => {
    if (location.pathname === "/analytics") return;
    const now = Date.now();
    const entryTime = new Date(now).toISOString();
    entryTimeRef.current = now;

    const payload = {
      // User
      username: user,
      // Page
      page: location.pathname,
      referrer: document.referrer || null,
      previousPage: prevPageRef.current,
      // Time
      entryTime,
      localDate: new Date().toLocaleDateString("id-ID"),
      localTime: new Date().toLocaleTimeString("id-ID"),
      dayOfWeek: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      hour: new Date().getHours(),
      // Device & Browser
      ...getDeviceInfo(),
      ...getBrowserInfo(),
      // Page meta
      pageTitle: document.title,
      pageUrl: window.location.href,
      queryString: window.location.search,
      hash: window.location.hash,
    };

    fetch(`${API}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    prevPageRef.current = location.pathname;

    // Track time on page when leaving
    return () => {
      const duration = Math.round((Date.now() - entryTimeRef.current) / 1000);
      fetch(`${API}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          page: location.pathname,
          eventType: "page_exit",
          durationSeconds: duration,
          exitTime: new Date().toISOString(),
        }),
      }).catch(() => {});
    };
  }, [location.pathname, user]);
}
