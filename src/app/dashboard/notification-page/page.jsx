"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
const notificationsData = [
  {
    id: 1,
    title: "Team Invite Notification",
    description: 'You’ve been invited to join the "Document Review Team" by Sarah Malik.',
    time: "3 Minutes ago",
    actions: ["Accept", "Decline"],
    icon: "📧",
    unread: true,
  },
  {
    id: 2,
    title: "Billing Reminder",
    description: "Your Pro plan will renew on April 20, 2025.",
    time: "4 days ago",
    actions: ["Manage", "Ignore"],
    icon: "💳",
    unread: true,
  },
  {
    id: 3,
    title: "Security Update",
    description: "Two-Factor Authentication has been enabled.",
    time: "10 days ago",
    actions: [],
    icon: "🔒",
    unread: false,
  },
  {
    id: 4,
    title: "Limited-Time Offer",
    description: "Get 20% off on annual Team plans. Upgrade now and save more on your next billing cycle. Offer valid for a limited period",
    time: "1 Week ago",
    actions: ["Upgrade Plan", "Ignore"],
    icon: "🎁",
    unread: false,
  },
  {
    id: 5,
    title: "Team Member Added",
    description: 'Zoya Rehman joined your "Design" workspace.',
    time: "1 Month ago",
    actions: ["View Team", "Ignore"],
    icon: "👤",
    unread: false,
  },
];

const NotificationPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editMode, setEditMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const router = useRouter();

  const filteredNotifications = notificationsData.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread" && n.unread) return true;
    return false;
  });

  const sortedNotifications = filteredNotifications.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.time) - new Date(a.time);
    }
    return new Date(a.time) - new Date(b.time);
  });

  const handleEditButton = (e) => {
    setEditMode(!editMode);
    setSelectedNotifications([]);
  };

  const handleSelectAll = (e) => {
    setSelectedNotifications(
      sortedNotifications.map((n) => n.id)
    );
  };

  const handleMarkAsRead = (e) => {
    setSelectedNotifications(
      selectedNotifications.filter((id) => !sortedNotifications.find((n) => n.id === id).unread)
    );
    sortedNotifications.forEach((n) => {
      if (selectedNotifications.includes(n.id)) {
        n.unread = false;
      }
    });
  };

  return (
    <div className="p-10 flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-primary text-white p-2 rounded-full"
          >
            <IoMdArrowRoundBack size={24} />
          </button>
          <div className="flex w-full justify-between items-center">
            <h4 className="heading-4">{editMode ? "Edit Notifications" : "Notifications"}</h4>
            <button
              className="text-primary subtitle-text"
              onClick={handleEditButton}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
            {editMode && (
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-md font-medium text-sm bg-blue-600 text-white"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium text-sm bg-blue-600 text-white"
                  onClick={handleMarkAsRead}
                >
                  Mark as Read
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Notifications sections */}

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-1.5 rounded-full font-semibold ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-5 py-1.5 rounded-full font-semibold ${
                  filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                Unread ({filteredNotifications.filter((n) => n.unread).length})
              </button>
            </div>
            <div className="flex-1" />
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          {/* Notification Cards */}
          <div className="w-full">
            {sortedNotifications
              .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
              .map((n) => (
                <div
                  key={n.id}
                  className="flex items-center border-b border-gray-100 py-4 gap-4"
                >
                  {editMode && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(n.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications([...selectedNotifications, n.id]);
                          } else {
                            setSelectedNotifications(
                              selectedNotifications.filter((id) => id !== n.id)
                            );
                          }
                        }}
                        className="mt-1 mr-2 w-4 h-4"
                      />
                    </div>
                  )}
                  <span className="text-2xl">{n.icon}</span>
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-base ${
                        n.unread ? "text-primary" : "text-secondary-foreground"
                      }`}
                    >
                      {n.title}
                    </div>
                    <div className="text-gray-600 my-1 text-sm">
                      {n.description}
                    </div>
                    <div className="text-gray-400 text-xs">{n.time}</div>
                  </div>
                  <div className="flex gap-2">
                    {n.actions.map((label, i) => (
                      <button
                        key={i}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                          i === 0
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                        disabled
                      >
                        {label}
                      </button>
                    ))}
                    {n.title === "Security Update" && (
                      <button
                        className="bg-none border-none text-gray-400 text-2xl px-2"
                        title="Dismiss"
                        disabled
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
