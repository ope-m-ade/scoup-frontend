import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft } from "lucide-react";

interface FacultySignupProps {
  onNavigate?: (page: "login" | "signup") => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function FacultySignupPage({ onNavigate }: FacultySignupProps) {
  const routerNavigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setMessage("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/faculty/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Signup failed. Please check your information."
        );
      }

      setMessage(data?.message || "Account created! Awaiting approval.");
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
      });

      // return to login view after short pause so user sees success state
      setTimeout(() => {
        if (onNavigate) {
          onNavigate("login");
        } else {
          routerNavigate("/faculty-login");
        }
      }, 1200);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unexpected error. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="shadow-lg w-full max-w-lg mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Faculty Sign Up</CardTitle>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (onNavigate) {
                onNavigate("login");
              } else {
                routerNavigate("/faculty-login");
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={submit} className="space-y-3 mt-4">
            <div>
              <Label>Username *</Label>
              <Input
                value={formData.username}
                onChange={(e) => onChange("username", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => onChange("first_name", e.target.value)}
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => onChange("last_name", e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
