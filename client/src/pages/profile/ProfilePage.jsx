import React from "react";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";

const ProfilePage = () => {
  const { user } = useAuth();
  const initial = (user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        subtitle="Your account information."
      />

      <div className="card p-6 md:p-8 animate-fade-up">
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-line">
          <div className="w-16 h-16 rounded-xl bg-accent text-accent-fg flex items-center justify-center font-display text-3xl font-semibold">
            {initial}
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-fg">
              {user?.username || "User"}
            </p>
            <p className="text-sm text-fg-muted">{user?.email}</p>
          </div>
        </div>

        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="field-label">Username</dt>
            <dd className="text-sm text-fg">{user?.username || "—"}</dd>
          </div>
          <div>
            <dt className="field-label">Email</dt>
            <dd className="text-sm text-fg">{user?.email || "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfilePage;
