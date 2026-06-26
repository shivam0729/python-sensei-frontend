import TopNavigation from "./TopNavigation"; 

export default function DashboardLayout({
  children,
  activeSection,
  setActiveSection,
  handleLogout,
}) {
  return (
    <div className="dashboard-layout-root">
      <TopNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <div className="dashboard-layout-main">
        <main style={{ display: "flex", flexDirection: "column", gap: "25px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}