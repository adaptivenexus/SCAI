"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/GlobalProvider";

const NotificationPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editMode, setEditMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [popupType, setPopupType] = useState(null); // 'client' or 'document'
  const router = useRouter();
  const { clients, documents } = useContext(GlobalContext);

  // Filter unverified clients and documents
  const unverifiedClients = Array.isArray(clients)
    ? clients.filter((c) => c.status !== "Verified")
    : [];
  const unverifiedDocuments = Array.isArray(documents)
    ? documents.filter((d) => !d.is_verified)
    : [];

  // Compose notification objects
  function getDocumentName(doc) {
    // Try to get the best document name
    if (doc.parsed_data && doc.parsed_data.suggested_title)
      return doc.parsed_data.suggested_title;
    if (doc.name) return doc.name;
    if (doc.title) return doc.title;
    if (doc.file) {
      try {
        const urlObj = new URL(doc.file);
        const pathname = urlObj.pathname;
        const decodedPath = decodeURIComponent(pathname);
        const segments = decodedPath.split("/");
        return segments[segments.length - 1];
      } catch {
        return doc.file;
      }
    }
    return doc.id;
  }

  function getDocumentClientName(doc) {
    // Try to get the client name or email
    if (doc.client_name) return doc.client_name;
    if (doc.client) return doc.client;
    if (doc.client_id && Array.isArray(clients)) {
      const found = clients.find((c) => String(c.id) === String(doc.client_id));
      if (found)
        return found.business_name || found.name || found.email || found.id;
    }
    return "Unknown Client";
  }

  const notificationsData = [
    ...unverifiedClients.map((client) => ({
      id: `client-${client.id}`,
      type: "client",
      title: `Unverified Client: ${
        client.name || client.business_name || client.email || client.id
      }`,
      description: `Client ${
        client.name || client.business_name || client.email || client.id
      } is not verified.`,
      time: client.created_at || "",
      unread: true,
      data: client,
    })),
    ...unverifiedDocuments.map((doc) => ({
      id: `document-${doc.id}`,
      type: "document",
      title: `Unverified Document: ${getDocumentName(doc)}`,
      description: `Client: ${getDocumentClientName(doc)}`,
      time: doc.uploaded_at || "",
      unread: true,
      data: doc,
    })),
  ];

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
    setSelectedNotifications(sortedNotifications.map((n) => n.id));
  };

  const handleMarkAsRead = (e) => {
    setSelectedNotifications(
      selectedNotifications.filter(
        (id) => !sortedNotifications.find((n) => n.id === id).unread
      )
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
            <h4 className="heading-4">
              {editMode ? "Edit Notifications" : "Notifications"}
            </h4>
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
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-5 py-1.5 rounded-full font-semibold ${
                  filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
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
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {sortedNotifications
              .filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((n) => (
                <div
                  key={n.id}
                  className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex items-center justify-between"
                >
                  {editMode && (
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(n.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications([
                            ...selectedNotifications,
                            n.id,
                          ]);
                        } else {
                          setSelectedNotifications(
                            selectedNotifications.filter((id) => id !== n.id)
                          );
                        }
                      }}
                      className="absolute top-3 left-3 w-4 h-4"
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {n.type === "client" ? "👤" : "📄"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-semibold text-sm sm:text-base ${
                            n.unread
                              ? "text-primary"
                              : "text-secondary-foreground"
                          }`}
                        >
                          {n.title}
                        </div>
                        {n.unread && (
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div className="text-gray-600 my-1 text-sm">
                        {n.description}
                      </div>
                      <div className="text-gray-400 text-xs">{n.time}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 rounded-md font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() => {
                        if (n.type === "client") {
                          router.push(
                            `/dashboard/client-management/client-list?verify=1&id=${n.data.id}`
                          );
                        } else if (n.type === "document") {
                          router.push(
                            `/dashboard/document-management/all-documents?verify=1&id=${n.data.id}`
                          );
                        }
                      }}
                    >
                      Verify Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Popup for client/document verification */}
        {popupData && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[90vw] relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setPopupData(null)}
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-4">
                {popupType === "client" ? "Verify Client" : "Verify Document"}
              </h3>
              <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto max-h-60">
                {JSON.stringify(popupData, null, 2)}
              </pre>
              {/* You can replace the above with a custom component for better UI */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
