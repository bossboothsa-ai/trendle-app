import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Rewards from "@/pages/Rewards";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import SurveysTasks from "@/pages/SurveysTasks";
import SettingsPage from "@/pages/Settings";
import Wallet from "@/pages/Wallet";
import BusinessOnboarding from "@/pages/business/BusinessOnboarding";
import PendingApproval from "@/pages/business/PendingApproval";
import BusinessDashboard from "@/pages/business/BusinessDashboard";
import BusinessMoments from "@/pages/business/Moments";
import BusinessSurveys from "@/pages/business/Surveys";
import BusinessTasks from "@/pages/business/Tasks";
import BusinessRewards from "@/pages/business/Rewards";
import AudienceInsights from "@/pages/business/AudienceInsights";
import BusinessReports from "@/pages/business/Reports";
import BusinessBilling from "@/pages/business/BillingSubscription";
import BusinessSettings from "@/pages/business/Settings";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBusinesses from "@/pages/admin/Businesses";
import BusinessDetails from "@/pages/admin/BusinessDetails";
import AdminUsers from "@/pages/admin/Users";
import AdminActivityLogs from "@/pages/admin/ActivityLogs";
import AdminModeration from "@/pages/admin/Moderation";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminSettings from "@/pages/admin/Settings";
import Unauthorized from "@/pages/Unauthorized";
import { BusinessProvider } from "@/context/BusinessContext";
import { AuthProvider } from "@/hooks/use-auth";
import { DemoProvider } from "@/context/DemoContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import VerifyEmail from "@/pages/VerifyEmail";
// Layouts
import UserLayout from "@/layouts/UserLayout";
import BusinessLayout from "@/layouts/BusinessLayout";
import AdminLayout from "@/layouts/AdminLayout";

function Router() {
  return (
    <>
      <Switch>
        {/* === PUBLIC & AUTH === */}
        <Route path="/user/login" component={AuthPage} />
        <Route path="/user/register" component={AuthPage} />
        <Route path="/auth" component={AuthPage} />

        {/* Business Onboarding (No Layout) */}
        <Route path="/business/register" component={BusinessOnboarding} />
        <Route path="/business/pending-approval" component={PendingApproval} />

        {/* Verification & Errors */}
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/unauthorized" component={Unauthorized} />

        {/* === BUSINESS SECTION === */}
        <Route path="/business">
          <Redirect to="/business/dashboard" />
        </Route>
        <Route path="/business/dashboard">
          <BusinessLayout><BusinessDashboard /></BusinessLayout>
        </Route>
        <Route path="/business/moments">
          <BusinessLayout><BusinessMoments /></BusinessLayout>
        </Route>
        <Route path="/business/surveys">
          <BusinessLayout><BusinessSurveys /></BusinessLayout>
        </Route>
        <Route path="/business/tasks">
          <BusinessLayout><BusinessTasks /></BusinessLayout>
        </Route>
        <Route path="/business/rewards">
          <BusinessLayout><BusinessRewards /></BusinessLayout>
        </Route>
        <Route path="/business/audience-insights">
          <BusinessLayout><AudienceInsights /></BusinessLayout>
        </Route>
        <Route path="/business/reports">
          <BusinessLayout><BusinessReports /></BusinessLayout>
        </Route>
        <Route path="/business/billing">
          <BusinessLayout><BusinessBilling /></BusinessLayout>
        </Route>
        <Route path="/business/settings">
          <BusinessLayout><BusinessSettings /></BusinessLayout>
        </Route>

        {/* === ADMIN SECTION === */}
        <Route path="/admin">
          <Redirect to="/admin/dashboard" />
        </Route>
        <Route path="/admin/dashboard">
          <AdminLayout><AdminDashboard /></AdminLayout>
        </Route>
        <Route path="/admin/businesses">
          <AdminLayout><AdminBusinesses /></AdminLayout>
        </Route>
        <Route path="/admin/businesses/:id">
          <AdminLayout><BusinessDetails /></AdminLayout>
        </Route>
        <Route path="/admin/users">
          <AdminLayout><AdminUsers /></AdminLayout>
        </Route>
        <Route path="/admin/activity">
          <AdminLayout><AdminActivityLogs /></AdminLayout>
        </Route>
        <Route path="/admin/moderation">
          <AdminLayout><AdminModeration /></AdminLayout>
        </Route>
        <Route path="/admin/subscriptions">
          <AdminLayout><AdminSubscriptions /></AdminLayout>
        </Route>
        <Route path="/admin/settings">
          <AdminLayout><AdminSettings /></AdminLayout>
        </Route>

        {/* === USER SECTION (Root) === */}
        <Route path="/">
          <UserLayout><Home /></UserLayout>
        </Route>
        <Route path="/home">
          <UserLayout><Home /></UserLayout>
        </Route>
        <Route path="/explore">
          <UserLayout><Explore /></UserLayout>
        </Route>
        <Route path="/rewards">
          <UserLayout><Rewards /></UserLayout>
        </Route>
        <Route path="/profile">
          <UserLayout><Profile /></UserLayout>
        </Route>
        <Route path="/profile/:id">
          <UserLayout><Profile /></UserLayout>
        </Route>
        <Route path="/notifications">
          <UserLayout><Notifications /></UserLayout>
        </Route>
        <Route path="/surveys-tasks">
          <UserLayout><SurveysTasks /></UserLayout>
        </Route>
        <Route path="/wallet">
          <UserLayout><Wallet /></UserLayout>
        </Route>
        <Route path="/settings">
          <UserLayout><SettingsPage /></UserLayout>
        </Route>

        {/* 404 - Last Resort */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BusinessProvider>
          <DemoProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </DemoProvider>
        </BusinessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
