import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/faculty/dashboard", label: "Dashboard Overview" },
  { to: "/faculty/profile", label: "Profile" },
  { to: "/faculty/papers", label: "Papers" },
  { to: "/faculty/projects", label: "Projects" },
  { to: "/faculty/patents", label: "Patents" },
  { to: "/faculty/uploads", label: "PDF Uploads" },
];

export default function FacultyLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-border bg-muted/40">
          <div className="p-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Faculty Portal
            </p>
            <h2 className="text-xl font-semibold">SCOUP</h2>
          </div>
          <nav className="flex flex-col gap-1 px-4 pb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
                end
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
