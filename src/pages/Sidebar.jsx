import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "overview", icon: "🏠", label: "Overview", path: "/dashboard" },
  { id: "history",  icon: "📋", label: "History",  path: "/history" },
  { id: "progress", icon: "📈", label: "Progress", path: "/progress" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="db-sidebar">
      <div className="db-sidebar-logo">
        <div className="db-logo-mark">AI</div>
        <span className="db-logo-name">CrackIt.AI</span>
      </div>

      <nav className="db-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`db-nav-item ${
              location.pathname === item.path ? "db-nav-item--active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="db-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <button className="db-nav-item" onClick={() => navigate("/admin_portal")}>
          <span className="db-nav-icon">🛡️</span>
          Admin Panel
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
