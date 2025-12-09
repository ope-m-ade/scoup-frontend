import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const navItems = [
  { to: "/faculty/dashboard", label: "DASHBOARD" },
  { to: "/faculty/profile", label: "PROFILE" },
  { to: "/faculty/papers", label: "PAPERS" },
  { to: "/faculty/projects", label: "PROJECTS" },
  { to: "/faculty/patents", label: "PATENTS" },
];

export default function FacultyLayout() {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // load photos
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("facultyAccessToken");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/faculty/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();
      setPhotoUrl(data.photo || null);
    };

    loadProfile();
  }, []);

  // handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show preview instantly
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // upload to backend
    const formData = new FormData();
    formData.append("photo", file);

    fetch(`${API_BASE_URL}/faculty/upload-photo/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("facultyAccessToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotoUrl(data.photo);
        setPreview(null);
      })
      .catch(() => console.error("Photo upload failed"));
  };

  // ------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("facultyAccessToken");
    localStorage.removeItem("facultyRefreshToken");
    navigate("/faculty/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {showModal && photoUrl && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <img
              src={photoUrl}
              className="max-w-[80%] max-h-[80%] rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {/* SIDEBAR */}
        <aside className="faculty-sidebar border-r border-border flex flex-col">
          <div className="pt-20 pb-6 flex flex-col items-center text-center">
            <h2 className="faculty-brand">SCOUP</h2>

            {/* PROFILE AVATAR */}
            <div
              className="sidebar-avatar"
              onClick={() => photoUrl && setShowModal(true)}
            >
              {preview ? (
                <img src={preview} className="sidebar-avatar-img" />
              ) : photoUrl ? (
                <img src={photoUrl} className="sidebar-avatar-img" />
              ) : (
                <div className="sidebar-avatar-placeholder">
                  <span className="sidebar-avatar-icon">👤</span>
                </div>
              )}

              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              <button
                type="button"
                className="sidebar-avatar-edit"
                onClick={() => document.getElementById("photoUpload")!.click()}
              >
                ✎
              </button>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Log Out
            </button>
          </div>

          <div className="flex-1" />

          {/* NAVIGATION LINKS */}
          <nav className="flex flex-col items-center gap-4 px-4 pb-6 mt-28">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `faculty-nav-item ${isActive ? "faculty-nav-active" : ""}`
                }
                end
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
