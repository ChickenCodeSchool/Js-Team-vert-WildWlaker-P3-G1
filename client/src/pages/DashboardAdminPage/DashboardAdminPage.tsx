import { useState } from "react";
import { useLocation } from "react-router";
import AdminBookings from "../../components/DashboardAdmin/AdminBookings/AdminBookings";
import AdminClaims from "../../components/DashboardAdmin/AdminClaims/AdminClaims";
import AdminEventRequests from "../../components/DashboardAdmin/AdminEventRequests/AdminEventRequests";
import AdminEvents from "../../components/DashboardAdmin/AdminEvents/AdminEvents";
import AdminOverview from "../../components/DashboardAdmin/AdminOverview/AdminOverview";
import AdminReservations from "../../components/DashboardAdmin/AdminReservations/AdminReservations";
import AdminSpaces from "../../components/DashboardAdmin/AdminSpaces/AdminSpaces";
import AdminStats from "../../components/DashboardAdmin/AdminStats/AdminStats";
import DashboardAdminNav from "../../components/DashboardAdmin/DashboardAdminNav/DashboardAdminNav";
import "./DashboardAdminPage.css";
import FooterDashboard from "../../components/FooterDashboard/FooterDashboard";
import { logout } from "../../hooks/apiFetch";

function getTodayDate() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function DashboardAdminPage() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const isSpacesTab = location.hash === "#admin-spaces";
  const isBookingsTab = location.hash === "#admin-bookings";
  const isClaimsTab = location.hash === "#admin-claims";
  const isEventsTab = location.hash === "#admin-events";

  return (
    <section className="dashboard-admin-page">
      <div className="dashboard-admin-page__header">
        <h1 className="dashboard-admin-page__heading">Tableau de bord</h1>

        <div className="dashboard-admin-page__header-actions">
          <button className="logOutButton" type="button" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
      <DashboardAdminNav />
      <div className="dashboard-admin-content">
        {isSpacesTab ? (
          <div className="dashboard-admin-section" id="admin-spaces">
            <AdminSpaces />
          </div>
        ) : isBookingsTab ? (
          <div className="dashboard-admin-section" id="admin-bookings">
            <AdminReservations />
          </div>
        ) : isClaimsTab ? (
          <div className="dashboard-admin-section" id="admin-claims">
            <AdminClaims />
          </div>
        ) : isEventsTab ? (
          <div className="dashboard-admin-section" id="admin-events">
            <AdminEvents />
          </div>
        ) : (
          <>
            <div className="dashboard-admin-section dashboard-admin-page__date-filter">
              <label
                className="dashboard-admin-page__date-label"
                htmlFor="dashboard-admin-date"
              >
                Date du tableau de bord
              </label>
              <input
                className="dashboard-admin-page__date-input"
                id="dashboard-admin-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>
            <div className="dashboard-admin-section" id="admin-dashboard">
              <AdminStats selectedDate={selectedDate} />
            </div>
            <div className="dashboard-admin-section">
              <AdminOverview selectedDate={selectedDate} />
            </div>
            <div className="dashboard-admin-section">
              <AdminEventRequests />
            </div>
            <div className="dashboard-admin-section" id="admin-bookings">
              <AdminBookings previewLimit={4} />
            </div>
          </>
        )}
      </div>
      <div className="dashboard-admin-footer">
        <FooterDashboard />
      </div>
    </section>
  );
}

export default DashboardAdminPage;
