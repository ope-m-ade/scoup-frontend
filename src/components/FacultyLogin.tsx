import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { User as UserIcon, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface FacultyLoginProps {
  onNavigate?: (page: "login" | "signup") => void;
  onBack?: () => void;
}

function FacultyLogin({ onNavigate, onBack }: FacultyLoginProps) {
  const routerNavigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const onChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() === "" || formData.password === "") {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.error || "Login failed. Please try again."
        );
      }

      if (data?.access) {
        localStorage.setItem("facultyAccessToken", data.access);
      }
      if (data?.refresh) {
        localStorage.setItem("facultyRefreshToken", data.refresh);
      }

      routerNavigate("/faculty/login-success", {
        state: {
          username: formData.username.trim(),
          tokens: { access: data?.access, refresh: data?.refresh },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="shadow-lg w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription>
            Sign in to access your faculty dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Your faculty username"
                value={formData.username}
                onChange={(e) => onChange("username", e.target.value)}
                className="pl-12"
              />
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 text-muted-foreground" />
            </div>
          </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  className="pl-12 pr-12"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 text-muted-foreground" />

                {/* <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 inset-y-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5" />
                  ) : (
                    <Eye className="h-5" />
                  )}
                </Button> */}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-muted-foreground">
              Need access to SCOUP?
            </p>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => {
              if (onNavigate) {
                onNavigate("signup");
              } else {
                routerNavigate("/faculty/signup");
              }
            }}
          >
            Sign Up Now
          </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { FacultyLogin };
export default FacultyLogin;
