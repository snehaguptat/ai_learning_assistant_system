import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService.js";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Logged in Successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credintials.",
      );
      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning."
      footer={
        <p className="text-center text-sm text-fg-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        {/* Email field */}
        <div>
          <label className="field-label">Email</label>
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-150 ${focusedField === "email" ? "text-accent" : "text-fg-subtle"}`}
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="field pl-11"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label className="field-label">Password</label>
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-150 ${focusedField === "password" ? "text-accent" : "text-fg-subtle"}`}
            >
              <Lock className="h-[18px] w-[18px]" strokeWidth={2} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="field pl-11"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-danger/10 border border-danger/30 p-3">
            <p className="text-xs text-danger font-medium text-center">
              {error}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="group btn btn-primary btn-lg w-full"
        >
          {loading ? (
            <>
              <div className="spin-sm" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                strokeWidth={2.5}
              />
            </>
          )}
        </button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
