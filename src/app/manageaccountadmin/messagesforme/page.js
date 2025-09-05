'use client';
import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { toast } from "react-toastify";

export default function MessagesForMe() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          // Sort by createdAt descending (recent first)
          const sorted = result.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMessages(sorted);
        } else {
          toast.error(result.error || "Failed to load messages");
        }
      } catch (error) {
        toast.error("Error fetching messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h1 className="mb-4">Messages</h1>

        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="list-group">
            {messages.map((msg) => (
              <div key={msg._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{msg.name}</strong> <br />
                    <small>{msg.phone || "No phone"}</small> <br />
                    <small>{msg.email || "No email"}</small>
                  </div>
                  <button
                    className="btn btn-link"
                    onClick={() => toggleAccordion(msg._id)}
                  >
                    {expandedId === msg._id ? "Hide Message" : "See Message"}
                  </button>
                </div>
                {expandedId === msg._id && (
                  <div className="mt-3 border-top pt-2">
                    <p className="mb-0">{msg.messagetext}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
