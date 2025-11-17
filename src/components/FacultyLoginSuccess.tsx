import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessState {
  username?: string;
  tokens?: {
    access?: string;
    refresh?: string;
  };
}

export default function FacultyLoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SuccessState) || {};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full shadow-lg text-center space-y-4">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Login Successful</CardTitle>
          <CardDescription>
            {state.username
              ? `Welcome back, ${state.username}!`
              : "Welcome back to SCOUP."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your access token is stored locally. Use it to call secured faculty
            endpoints.
          </p>
          {state.tokens?.access && (
            <div className="rounded-lg border bg-muted/40 p-3 text-xs break-all text-left">
              <strong>Access token:</strong> {state.tokens.access}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => navigate("/faculty-login")}>
              Back to Login
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/faculty/dashboard", { state, replace: true })
              }
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
