// app/dashboard/layout.js

export default function DashboardLayout({ children }) {
  return (
    <div style={{ padding: "20px", minHeight: "80vh" }}>
      {children}
    </div>
  );
}
