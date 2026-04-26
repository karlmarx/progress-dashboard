"use client";

import { useEffect, useState } from "react";
import { Section } from "@/lib/status";
import TaskSection from "./TaskSection";

interface DashboardProps {
  email: string;
}

export default function Dashboard({ email }: DashboardProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/status");
        const data = await response.json();
        setSections(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0808] text-white">
      <header className="border-b border-[#1a1a24] p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Progress <span className="text-[#ff3355]">Dashboard</span>
          </h1>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <p className="text-[#8888aa] text-sm">
                Updated: <span className="text-white">{lastUpdated}</span>
              </p>
            )}
            <p className="text-[#8888aa] text-sm">
              Signed in as <span className="text-white">{email}</span>
            </p>
            <button
              onClick={() => { window.location.href = "https://9193.cloudflareaccess.com/cdn-cgi/access/logout"; }}
              className="px-4 py-2 bg-[#ff3355] text-white rounded hover:bg-[#ff2070] font-semibold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {loading ? (
          <p className="text-[#8888aa]">Loading status...</p>
        ) : (
          <>
            {sections.map((section) => (
              <TaskSection key={section.title} section={section} />
            ))}
          </>
        )}
      </main>
    </div>
  );
}
