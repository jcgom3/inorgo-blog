import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Import Tailwind styles

interface Journal {
  id: number;
  title: string;
  description: string;
  written_by: string;
  created_at: string;
  email: string;
}

const Dashboard = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [written_by, setWrittenBy] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [email, setEmail] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "";

  // Fetch journals from backend
  useEffect(() => {
    const fetchJournals = async () => {
      
      try {
        const response = await fetch(`${API_URL}/journals`);
        if (!response.ok) throw new Error("Failed to fetch journals");
        const data: Journal[] = await response.json();
        setJournals(data);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJournal = {
      title,
      description,
      content,
      written_by,
      created_at,
      email,
    };

    try {
      const response = await fetch(`${API_URL}/journals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJournal),
      });
      if (!response.ok)
        throw new Error("Failed to add journal");
      const savedJournal =
        (await response.json());
      setJournals([savedJournal, ...journals]);
      setTitle("");
      setDescription("");
      setContent("");
      setWrittenBy("");
      setCreatedAt("");
      setEmail("");
    } catch (error) {
      console.error("Error adding journal:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          User Dashboard - Add a New Journal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Description:
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Content:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Written By:
            </label>
            <input
              type="text"
              value={written_by}
              onChange={(e) => setWrittenBy(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
            <small>
              This email is for search purposes and upcoming functionality.
            </small>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Published on:
            </label>
            <input
              type="date"
              value={created_at}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Latest Journals
        </h2>
        <ul className="space-y-4">
          {journals.length > 0 ? (
            journals.map((journal) => (
              <li key={journal.id} className="text-center">
                <Link
                  to={`/blog/${journal.id}`}
                  className="text-blue-600 hover:underline text-lg"
                >
                  <div>
                    <strong>{journal.title}</strong>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Written By: {journal.written_by}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Date: {new Date(journal.created_at).toLocaleDateString()}
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-600">
              No journals available at the moment.
            </p>
          )}
        </ul>
      </section>
    </main>
  );
};

export default Dashboard;
