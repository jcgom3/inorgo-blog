import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Journal {
  id: number;
  title: string;
  description: string;
  content: string;
  written_by: string;
  created_at: string;
  db_created_at: string;
}

const AdminDashboard = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(""); // To hold the selected sort option
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      const API_URL = process.env.REACT_APP_API_URL || "";
      try {
        const response = await fetch(`${API_URL}/journals`);
        const data =
          (await response.json());
        setJournals(data);
        setFilteredJournals(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  // Helper function to capitalize words in written_by
  const formatName = (name: string): string => {
    const isAlphabetic = /^[a-zA-Z\s]+$/.test(name);
    if (!isAlphabetic) return name; // Leave as is if non-alphabetic

    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter and sort journals
  useEffect(() => {
    let updatedJournals = [...journals];

    // Filter by search query
    if (searchQuery) {
      updatedJournals = updatedJournals.filter(
        (journal) =>
          journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          journal.written_by.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected option
    if (sortOption === "timestamp-asc") {
      updatedJournals.sort(
        (a, b) =>
          new Date(a.db_created_at).getTime() -
          new Date(b.db_created_at).getTime()
      );
    } else if (sortOption === "timestamp-desc") {
      updatedJournals.sort(
        (a, b) =>
          new Date(b.db_created_at).getTime() -
          new Date(a.db_created_at).getTime()
      );
    } else if (sortOption === "author-asc") {
      updatedJournals.sort((a, b) => a.written_by.localeCompare(b.written_by));
    } else if (sortOption === "author-desc") {
      updatedJournals.sort((a, b) => b.written_by.localeCompare(a.written_by));
    } else if (sortOption === "title-asc") {
      updatedJournals.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      updatedJournals.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredJournals(updatedJournals);
  }, [searchQuery, sortOption, journals]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or author"
          className="w-full lg:w-1/3 p-3 border rounded-lg focus:ring focus:ring-blue-300"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full lg:w-1/3 p-3 border rounded-lg focus:ring focus:ring-blue-300"
        >
          <option value="">Sort By</option>
          <option value="timestamp-asc">Timestamp (Oldest First)</option>
          <option value="timestamp-desc">Timestamp (Newest First)</option>
          <option value="author-asc">Author (A-Z)</option>
          <option value="author-desc">Author (Z-A)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>

      {/* Journals Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border">Title</th>
              <th className="p-4 border">Author</th>
              <th className="p-4 border">Published On</th>
              <th className="p-4 border bg-yellow-100">Actual Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredJournals.length > 0 ? (
              filteredJournals.map((journal) => (
                <tr key={journal.id}>
                  <td className="p-4 border">
                    <Link
                      to={`/blog/${journal.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {journal.title}
                    </Link>
                  </td>
                  <td className="p-4 border">
                    {formatName(journal.written_by)}
                  </td>
                  <td className="p-4 border">
                    {new Date(journal.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 border bg-yellow-100">
                    {new Date(journal.db_created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 border text-center text-gray-600"
                >
                  No journals match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
