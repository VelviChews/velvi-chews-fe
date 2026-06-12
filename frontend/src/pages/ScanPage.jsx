import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import "@google/model-viewer";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── State machine ────────────────────────────────────────────────
// "scanning"   → camera is active, waiting for QR
// "loading"    → API call in progress
// "success"    → points earned, show 3D model
// "duplicate"  → user already scanned this QR
// "error"      → invalid QR or other error

export default function ScanPage() {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const [phase, setPhase] = useState("scanning"); // scanning | loading | success | duplicate | error
    const [scanResult, setScanResult] = useState(null); // { points_received, total_points, message, label }
    const [errorMsg, setErrorMsg] = useState("");
    const [hasPermission, setHasPermission] = useState(null); // null = asking, true, false

    // ─── Start scanner ────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "scanning") return;

        let isMounted = true;
        let scanner;

        const startScanner = async () => {
            try {
                // Beri jeda sedikit agar DOM siap & mencegah race condition StrictMode
                await new Promise(res => setTimeout(res, 100));
                if (!isMounted) return;

                const { Html5Qrcode } = await import("html5-qrcode");

                // Pastikan div qr-reader kosong sebelum inisialisasi baru
                const qrElement = document.getElementById("qr-reader");
                if (qrElement) qrElement.innerHTML = "";

                scanner = new Html5Qrcode("qr-reader");
                html5QrCodeRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 240, height: 240 } },
                    handleScanSuccess,
                    () => { } // ignore minor errors
                );

                if (!isMounted) {
                    // Jika komponen sudah unmount saat kamera baru selesai nyala, matikan lagi
                    await scanner.stop();
                    html5QrCodeRef.current = null;
                } else {
                    setHasPermission(true);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Camera error:", err);
                    setHasPermission(false);
                }
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            if (html5QrCodeRef.current) {
                try {
                    html5QrCodeRef.current.stop().catch(() => { });
                } catch (e) {
                    // abaikan error jika stop dipanggil saat kamera belum sepenuhnya aktif
                }
                html5QrCodeRef.current = null;
            }
            // Bersihkan sisa elemen video yang mungkin tersangkut di DOM
            const qrElement = document.getElementById("qr-reader");
            if (qrElement) qrElement.innerHTML = "";
        };
    }, [phase]);

    // ─── Handle a successfully decoded QR ────────────────────────────
    const handleScanSuccess = async (decodedText) => {
        if (!html5QrCodeRef.current) return;

        // Stop scanner immediately to avoid double-scan
        try {
            await html5QrCodeRef.current.stop();
        } catch (_) { }

        setPhase("loading");

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ card_code: decodedText }),
            });

            const data = await res.json();

            if (res.ok) {
                setScanResult(data);
                setPhase("success");
            } else if (res.status === 400) {
                setPhase("duplicate");
                setErrorMsg(data.detail || "Kamu sudah pernah scan QR ini.");
            } else {
                setPhase("error");
                setErrorMsg(data.detail || "QR tidak valid.");
            }
        } catch {
            setPhase("error");
            setErrorMsg("Gagal terhubung ke server. Coba lagi.");
        }
    };

    // ─── Stop camera dan navigasi ─────────────────────────────────────
    const stopAndNavigate = async (path) => {
        if (html5QrCodeRef.current) {
            try { await html5QrCodeRef.current.stop(); } catch (_) { }
            html5QrCodeRef.current = null;
        }
        navigate(path);
    };

    // ─── Retry scan ───────────────────────────────────────────────────
    const handleRetry = () => {
        setScanResult(null);
        setErrorMsg("");
        setPhase("scanning");
    };

    // ─── Render ───────────────────────────────────────────────────────
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-black">
            {/* Back button */}
            <button
                onClick={() => stopAndNavigate("/home")}
                className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
            >
                <IoChevronBack size={22} />
            </button>

            {/* ── SCANNING PHASE ── */}
            {(phase === "scanning" || phase === "loading") && (
                <div className="relative flex h-screen w-full flex-col items-center justify-center">
                    {/* Camera viewfinder */}
                    <div id="qr-reader" ref={scannerRef} className="w-full" />

                    {/* Overlay frame */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        {phase === "loading" && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-[#FF89AC]" />
                            </div>
                        )}
                        <p className="mt-6 text-sm text-white/80">
                            {phase === "loading" ? "Memproses scan..." : "Arahkan kamera ke QR Code"}
                        </p>
                    </div>

                    {/* No permission warning */}
                    {hasPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-8 text-center text-white">
                            <div>
                                <p className="text-lg font-bold">Kamera tidak dapat diakses</p>
                                <p className="mt-2 text-sm text-white/60">
                                    Izinkan akses kamera di pengaturan browser kamu.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── SUCCESS PHASE ── */}
            {phase === "success" && scanResult && (
                <div className="flex min-h-screen flex-col items-center bg-white">
                    {/* 3D Model Viewer */}
                    <div className="relative h-72 w-full bg-gradient-to-b from-[#FF89AC] to-[#FCAFC1]">
                        <model-viewer
                            src="/gummybear.glb"
                            alt="Gummy Bear 3D"
                            auto-rotate
                            camera-controls
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            loading="eager"
                            reveal="auto"
                            style={{ width: "100%", height: "100%", backgroundColor: "transparent", display: "block" }}
                            shadow-intensity="1"
                        >
                            <div slot="progress-bar" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white mix-blend-screen" />
                                <p className="mt-2 text-xs font-semibold text-white mix-blend-screen">Memuat 3D Model...</p>
                            </div>
                        </model-viewer>
                        {/* AR badge */}
                        <span className="absolute right-4 top-4 rounded-full bg-white/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            ✦ AR
                        </span>
                    </div>

                    {/* Points card */}
                    <div className="mt-[-1.5rem] w-full rounded-t-3xl bg-white px-6 pt-8 pb-6">
                        <div className="flex flex-col items-center text-center">
                            {/* Confetti stars */}
                            <div className="mb-3 flex gap-2 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="h-5 w-5 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800">Scan Berhasil! 🎉</h2>
                            <p className="mt-1 text-sm text-gray-500">{scanResult.label}</p>

                            {/* Points badge */}
                            <div className="mt-6 flex items-center gap-4">
                                <div className="rounded-2xl bg-[#FF89AC]/10 px-8 py-4 text-center">
                                    <p className="text-4xl font-extrabold text-[#FF89AC]">+{scanResult.points_received}</p>
                                    <p className="text-xs text-gray-400">Poin diterima</p>
                                </div>
                                <div className="rounded-2xl bg-[#B4E2F2]/10 px-8 py-4 text-center">
                                    <p className="text-4xl font-extrabold text-[#B4E2F2]">{scanResult.total_points}</p>
                                    <p className="text-xs text-gray-400">Total poin</p>
                                </div>
                            </div>

                            <p className="mt-6 text-sm text-gray-500">{scanResult.message}</p>

                            <button
                                onClick={() => stopAndNavigate("/home")}
                                className="mt-8 w-full rounded-2xl bg-[#FF89AC] py-4 text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
                            >
                                Kembali ke Home
                            </button>
                            <button
                                onClick={() => stopAndNavigate("/history")}
                                className="mt-3 w-full rounded-2xl border border-[#FF89AC] py-4 text-base font-semibold text-[#FF89AC] active:scale-95 transition-transform"
                            >
                                Lihat History
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DUPLICATE / ERROR PHASE ── */}
            {(phase === "duplicate" || phase === "error") && (
                <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8 text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FF89AC]/10 text-5xl">
                        {phase === "duplicate" ? "🔒" : "❌"}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {phase === "duplicate" ? "Sudah Pernah Scan" : "QR Tidak Valid"}
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{errorMsg}</p>

                    <button
                        onClick={handleRetry}
                        className="mt-8 w-full max-w-xs rounded-2xl bg-[#FF89AC] py-4 text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
                    >
                        Scan Lagi
                    </button>
                    <button
                        onClick={() => stopAndNavigate("/home")}
                        className="mt-3 w-full max-w-xs rounded-2xl border border-gray-200 py-4 text-base font-semibold text-gray-500 active:scale-95 transition-transform"
                    >
                        Kembali ke Home
                    </button>
                </div>
            )}
        </div>
    );
}
