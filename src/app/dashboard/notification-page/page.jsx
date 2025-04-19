"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
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
          <div className=" flex w-full justify-between ">
            <h4 className="heading-4">Notifications</h4>
            <button className="text-primary subtitle-text">Edit</button>
          </div>
          
        </div>
        {/* Notifications sections */}


        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      {/* Tabs and Search (UI only) */}
      <div className="flex items-center mb-6">
        <div className="flex gap-2">
          <button className="px-5 py-1.5 rounded-full font-semibold bg-blue-600 text-white">
            All
          </button>
          <button className="px-5 py-1.5 rounded-full font-semibold bg-gray-100 text-gray-900">
            Unread (2)
          </button>
        </div>
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mr-4"
          disabled
        />
        <select className="border border-gray-200 rounded-md px-3 py-2 text-sm mr-2" disabled>
          <option>Newest</option>
          <option>Oldest</option>
        </select>
        <button className="bg-gray-100 rounded-md px-3 py-2 text-lg" disabled>
          <span className="text-xl">☰</span>
        </button>
      </div>
      {/* Notification Cards */}
      <div className="w-full">
        {notificationsData.map((n) => (
          <div
            key={n.id}
            className="flex items-start border-b border-gray-100 py-4 gap-4"
          >
            <span className="text-2xl mt-1 text-blue-600">{n.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-blue-700 text-base">
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
