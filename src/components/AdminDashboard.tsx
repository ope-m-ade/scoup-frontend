import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users2,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AdminDashboardProps {
  adminName?: string;
  onLogout?: () => void;
  onBackToHome?: () => void;
}

type NavigationLink = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const navigationLinks: NavigationLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "Approvals", icon: CheckCircle2, href: "#approvals" },
  { label: "Faculty", icon: Users2, href: "#faculty" },
  { label: "Specializations", icon: GraduationCap, href: "#specializations" },
  { label: "Publications & Projects", icon: BookOpen, href: "#publications" },
  { label: "Users & Roles", icon: UserCog, href: "#users" },
  { label: "Settings", icon: Settings, href: "#settings" },
];

const statHighlights = [
  { label: "Total Faculty", value: "120" },
  { label: "Pending Approvals", value: "5" },
  { label: "New Publications", value: "8" },
];

const recentActivity = [
  "Added Dr. Alice Johnson to Data Science specialization",
  "Updated publication count for Prof. Bob Smith",
  "Archived outdated collaboration project",
];

const pendingApprovals = [
  "Faculty profile update: Dr. Carol Davis",
  "New publication submission: AI in Healthcare",
  "Collaboration request: Robotics Lab",
];

export function AdminDashboard({
  adminName,
  onLogout,
  onBackToHome,
}: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col bg-black text-white shadow-2xl">
          <div className="border-b border-purple-500/60 p-6">
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            <p className="mt-1 text-sm text-gray-300">
              {adminName ? `Welcome, ${adminName}` : "Administrator"}
            </p>
          </div>

          <nav
            className="flex-1 space-y-2 px-4 py-6 text-sm"
            aria-label="Admin dashboard sections"
          >
            {navigationLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center justify-between rounded-md px-3 py-2 transition hover:bg-purple-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-purple-300" />
                  {label}
                </span>
                <ChevronRight className="h-4 w-4 text-purple-300" />
              </a>
            ))}
          </nav>

          <Separator className="bg-purple-500/40" />

          <div className="p-4">
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="secondary"
                className="w-full bg-purple-500 text-white hover:bg-purple-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </aside>

        <main className="flex-1 space-y-6 p-8">
          <header
            id="dashboard"
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-500">
                Overview of your faculty network and publication activity.
              </p>
            </div>
            {onBackToHome && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onBackToHome}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Homepage
                </Button>
              </div>
            )}
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statHighlights.map((stat) => (
              <Card key={stat.label} className="border-purple-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </section>

          <section
            id="approvals"
            className="grid gap-6 lg:grid-cols-2"
            aria-labelledby="approvals-heading"
          >
            <Card className="border-purple-200 shadow-sm" aria-labelledby="activity-heading">
              <CardHeader>
                <CardTitle id="activity-heading">Recent Activity</CardTitle>
                <CardDescription>
                  Updates from your faculty and research community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  {recentActivity.map((item) => (
                    <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="px-0 text-purple-600">
                  View all updates
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-sm" aria-labelledby="pending-heading">
              <CardHeader>
                <CardTitle id="pending-heading">Pending Approvals</CardTitle>
                <CardDescription>
                  Review requests awaiting administrator action.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  {pendingApprovals.map((item) => (
                    <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="px-0 text-purple-600">
                  Review all approvals
                </Button>
              </CardContent>
            </Card>
          </section>

          <section
            id="faculty"
            className="grid gap-6 lg:grid-cols-2"
            aria-labelledby="faculty-heading"
          >
            <Card className="border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle id="faculty-heading">Faculty Directory</CardTitle>
                <CardDescription>
                  Quick access to prominent faculty members and teams.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Data Science Division</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#faculty-data-science">View</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Engineering Collaborations</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#faculty-engineering">View</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>New Faculty Onboarding</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#faculty-onboarding">View</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-sm" id="specializations">
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
                <CardDescription>
                  Explore specialized programs and areas of expertise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Artificial Intelligence</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#specializations-ai">Manage</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Cybersecurity</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#specializations-cybersecurity">Manage</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Healthcare Informatics</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#specializations-health">Manage</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="publications"
            className="grid gap-6 lg:grid-cols-2"
            aria-labelledby="publications-heading"
          >
            <Card className="border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle id="publications-heading">Publications</CardTitle>
                <CardDescription>
                  Track recent submissions and highlight featured work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>AI in Healthcare</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#publication-ai">Details</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Climate Change Models</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#publication-climate">Details</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Cybersecurity Trends 2024</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#publication-cyber">Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-sm" id="users">
              <CardHeader>
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>
                  Manage permissions and administrative access levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Administrator Accounts</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#users-admins">Manage</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Faculty Accounts</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#users-faculty">Manage</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Role Requests</span>
                  <Button asChild variant="link" className="px-0 text-purple-600">
                    <a href="#users-roles">Review</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="settings" aria-labelledby="settings-heading">
            <Card className="border-purple-200 shadow-sm">
              <CardHeader>
                <CardTitle id="settings-heading">Administrator Settings</CardTitle>
                <CardDescription>
                  Configure notification preferences and security controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Email alerts</span>
                  <Button asChild variant="outline" size="sm">
                    <a href="#settings-email">Configure</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Two-factor authentication</span>
                  <Button asChild variant="outline" size="sm">
                    <a href="#settings-2fa">Manage</a>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>System maintenance</span>
                  <Button asChild variant="outline" size="sm">
                    <a href="#settings-maintenance">Schedule</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
