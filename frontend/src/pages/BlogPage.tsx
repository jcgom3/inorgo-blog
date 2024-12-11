import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // For URL params
import Header from "../components/Header";
import "../index.css"; // Import Tailwind styles

interface Journal {
  id: number;
  title: string;
  description: string;
  content: string;
  written_by: string; // Matches DB column
  created_at: string; // Matches DB column
}

const BlogPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
  const [journal, setJournal] = useState<Journal | null>(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        // Use the backend API endpoint
        const response = await fetch(`http://localhost:5000/journals/${id}`);
        const responseAPI = await fetch(`http://api/journals/${id}`);
        if (!response.ok || !responseAPI.ok) throw new Error("Failed to fetch journal");
        const data: Journal = await response.json() || await responseAPI.json();
        setJournal(data);
      } catch (error) {
        console.error("Error fetching journal:", error);
        setJournal(null); // Set to null if not found or error occurs
      }
    };

    fetchJournal();
  }, [id]);

  if (!journal) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Journal not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <Header />
      <article className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">{journal.title}</h1>
          <h1 className="text-black-600 mt-2">{journal.description}</h1>
        </header>
        <section className="prose prose-lg max-w-none">
          {/* You can add more fields if available */}
          {journal.content}
          <p className="text-gray-400 text-sm mt-4">
            Written by {journal.written_by} on{" "}
            {new Date(journal.created_at).toLocaleDateString()}
          </p>
        </section>
      </article>
    </main>
  );
};

export default BlogPage;
