import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner.jsx";
import progressService from "../../services/progressService.js";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const DashBoard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboard();

        setDashboardData(data.data);
      } catch (error) {
        toast.error("failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="icon-tile w-14 h-14 rounded-xl mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-fg-muted text-sm">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
    },
    {
      label: "Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
    },
    {
      label: "Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="eyebrow text-accent! mb-3">Overview</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Welcome back{user?.username ? `, ${user.username}` : ""}.
          </h1>
          <p className="text-fg-muted text-sm mt-3">
            Track your learning progress and recent activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 70}ms` }}
              className="group card p-6 animate-fade-up transition-colors duration-200 hover:border-accent/40"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow">{stat.label}</span>
                <span className="icon-tile icon-tile-accent w-9 h-9 group-hover:bg-accent group-hover:text-accent-fg transition-colors duration-200">
                  <stat.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                </span>
              </div>
              <div className="font-display text-6xl font-semibold tracking-tight tabular-nums leading-none">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div
          className="card p-6 md:p-8 animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="icon-tile w-9 h-9">
              <Clock className="w-[18px] h-[18px]" strokeWidth={2} />
            </span>
            <h3 className="text-xl font-semibold">Recent activity</h3>
          </div>

          {dashboardData.recentActivity &&
          (dashboardData.recentActivity.documents.length > 0 ||
            dashboardData.recentActivity.quizzes.length > 0) ? (
            <div className="divide-y divide-line border-y border-line">
              {[
                ...(dashboardData.recentActivity.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.title,
                    timeStamp: doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: "document",
                  }),
                ),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timeStamp: quiz.lastAccessed,
                  link: `/quizzes/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="group flex items-center justify-between gap-4 py-4 -mx-3 px-3 rounded-lg hover:bg-raised transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span
                        className={`chip w-16 justify-center font-mono text-[10px] uppercase tracking-wider ${
                          activity.type === "document" ? "chip-accent" : ""
                        }`}
                      >
                        {activity.type === "document" ? "Doc" : "Quiz"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-fg truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-fg-subtle mt-0.5">
                          {activity.type === "document"
                            ? "Accessed document"
                            : "Attempted quiz"}{" "}
                          · {new Date(activity.timeStamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {activity.link && (
                      <Link
                        to={activity.link}
                        className="btn btn-ghost btn-sm group-hover:text-accent"
                      >
                        View
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-14">
              <div className="icon-tile w-14 h-14 rounded-xl mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm text-fg">No recent activity yet.</p>
              <p className="text-sm text-fg-subtle mt-1">
                Start learning to see your progress here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
