"use client";

import "@/components/projects.css";
import { AdminPanel } from "@/components/sections/admin-panel";

export default function Admin() {
  return (
    <div className="pw-pg">
      <div className="top">
        <a href="/" className="pw-back">← Back to portfolio</a>
        <a href="/projects" className="pw-back">View Projects page</a>
      </div>
      <h1>Admin</h1>
      <AdminPanel />
    </div>
  );
}
