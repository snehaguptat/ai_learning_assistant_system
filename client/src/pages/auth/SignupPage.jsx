import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService.js";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password length must be atleast 6 characters long.");
      return;
    }
    if (username.length <= 3) {
      setError("Username must be atleast 4 characters long.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register(username, email, password);
      toast.success("Registration successful. Please login");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your AI-powered learning experience."
      footer={
        <p className="text-center text-sm text-fg-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="field-label">Username</label>
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-150 ${focusedField === "username" ? "text-accent" : "text-fg-subtle"}`}
            >
              <User className="h-[18px] w-[18px]" strokeWidth={2} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              className="field pl-11"
              placeholder="alex"
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
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
              Creating account...
            </>
          ) : (
            <>
              Create account
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
export default SignupPage;
