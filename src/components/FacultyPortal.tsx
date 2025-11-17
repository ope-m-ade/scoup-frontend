import { useState } from "react";
import FacultyLogin from "./FacultyLogin";
import FacultySignupPage from "./FacultySignup";

export default function FacultyPortal() {
  const [page, setPage] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {page === "login" ? (
        <FacultyLogin onNavigate={setPage} />
      ) : (
        <FacultySignupPage onNavigate={setPage} />
      )}
    </div>
  );
}
