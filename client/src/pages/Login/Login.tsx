import { useState } from "react";
import "./Login.css";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { apiFetch } from "../../hooks/apiFetch";

type Tab = "client" | "admin";

function getSafeRedirectPath() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");

  if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return null;
}

export default function Login() {
  const [tab, setTab] = useState<Tab>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const redirectPath = getSafeRedirectPath();
  const signInPath = redirectPath
    ? `/sign-in?redirect=${encodeURIComponent(redirectPath)}`
    : "/sign-in";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint =
      tab === "admin" ? "/api/auth/login/admin" : "/api/auth/login/client";

    try {
      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Identifiants incorrects.");
        return;
      }

      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      window.dispatchEvent(new Event("storage"));
      window.location.href =
        tab === "admin"
          ? "/dashboard-admin"
          : (redirectPath ?? "/dashboard-client");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === "client" ? "active" : ""}`}
            onClick={() => setTab("client")}
          >
            Client
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === "admin" ? "active" : ""}`}
            onClick={() => setTab("admin")}
          >
            Admin
          </button>
        </div>

        <form className="auth-form-wrapper" onSubmit={handleSubmit}>
          <h1 className="auth-title">Saisissez vos identifiants</h1>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-fields">
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password" className="auth-label">
                Mot de passe
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  title={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="auth-remember" htmlFor="remember">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Mémoriser mon mot de passe
            </label>
          </div>

          <div className="auth-footer">
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p className="auth-switch">
              Pas encore de compte ?{" "}
              <Link to={signInPath}>Créer un compte</Link>
            </p>
          </div>
        </form>
      </div>

      <div className="auth-visual" />
    </div>
  );
}
