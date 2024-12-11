// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../index.css"; // Import Tailwind styles
// import Layout from "../components/Layout";

// interface Journal {
//   id: number;
//   title: string;
//   written_by: string; // Matches DB column
//   created_at: string; // Matches DB column
// }

// export default function Home() {
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [searchQuery, setSearchQuery] = useState(""); // To hold the user's search input
//   const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]); // Filtered list
//   const [selectedDate, setSelectedDate] = useState(""); // To filter by a specific date

//   useEffect(() => {
//     const fetchJournals = async () => {
//       try {
//         const response = await fetch("http://api/journals");
//         if (!response.ok) throw new Error("Failed to fetch journals");

//         const data: Journal[] = await response.json();
//         setJournals(data); // Use data as-is
//         setFilteredJournals(data); // Initialize filtered list
//       } catch (error) {
//         console.error("Error fetching journals:", error);
//       }
//     };

//     fetchJournals();
//   }, []);

//   // Validate search query to exclude date-like strings
//   const isInvalidQuery = (query: string) => {
//     // Regex to detect date-like strings in the format YYYY-MM-DD
//     const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//     return datePattern.test(query);
//   };

//   // Filter journals based on search query and selected date
//   useEffect(() => {
//     const lowerCaseQuery = searchQuery.toLowerCase();
//     const filtered = journals.filter((journal) => {
//       const matchesSearchQuery =
//         !isInvalidQuery(searchQuery) && // Exclude date-like strings
//         (journal.title.toLowerCase().includes(lowerCaseQuery) ||
//           journal.written_by.toLowerCase().includes(lowerCaseQuery));

//       // Normalize date comparison
//       const createdAtDate = new Date(journal.created_at)
//         .toISOString()
//         .split("T")[0]; // Format as YYYY-MM-DD
//       const matchesDate =
//         !selectedDate || // If no date is selected, include all
//         createdAtDate === selectedDate;

//       return matchesSearchQuery && matchesDate;
//     });

//     setFilteredJournals(filtered);
//   }, [searchQuery, selectedDate, journals]);

//   return (
//     <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

//       <section className="mt-12 grid gap-6">
//         <Link
//           to="/dashboard"
//           className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
//         >
//           Go to Dashboard
//         </Link>
//         <Link
//           to="/references"
//           className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
//         >
//           Explore Scientific References
//         </Link>
//       </section>

//       {/* Journals Section */}
//       <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-12 flex flex-col items-center justify-center">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
//           Recent Journals
//         </h2>

//         {/* Search and Date Filter */}
//         <div className="mb-6 w-full max-w-lg flex flex-col gap-4">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by title or author"
//             className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
//           />

//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* Journals List */}
//         {filteredJournals.length > 0 ? (
//           <ul className="space-y-4 w-full text-center">
//             {filteredJournals.map((journal) => (
//               <li key={journal.id}>
//                 <Link
//                   to={`/blog/${journal.id}`}
//                   className="text-blue-600 hover:underline text-lg"
//                 >
//                   <div>
//                     <strong>{journal.title}</strong>
//                   </div>
//                   <div className="text-gray-600">
//                     Written By: {journal.written_by}
//                   </div>
//                   <div className="text-gray-400 text-sm">
//                     Published on:{" "}
//                     {new Date(journal.created_at).toLocaleDateString()}
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600">No journals match your search.</p>
//         )}
//       </section>
//     </main>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Import Tailwind styles

interface Journal {
  id: number;
  title: string;
  written_by: string; // Matches DB column
  created_at: string; // Matches DB column
}

export default function Home() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // To hold the user's search input
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]); // Filtered list
  const [selectedDate, setSelectedDate] = useState(""); // To filter by a specific date

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch("http://api/journals");
        if (!response.ok) throw new Error("Failed to fetch journals");

        const data: Journal[] = await response.json();
        setJournals(data); // Use data as-is
        setFilteredJournals(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  // Normalize dates to YYYY-MM-DD format
  const normalizeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Filter journals based on search query and selected date
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = journals.filter((journal) => {
      const matchesSearchQuery =
        searchQuery === "" || // Include all if search query is empty
        journal.title.toLowerCase().includes(lowerCaseQuery) ||
        journal.written_by.toLowerCase().includes(lowerCaseQuery);

      // Match selected date with normalized created_at field
      const normalizedCreatedAt = normalizeDate(journal.created_at);
      const matchesDate =
        selectedDate === "" || // Include all if no date is selected
        normalizedCreatedAt === selectedDate;

      return matchesSearchQuery && matchesDate;
    });

    setFilteredJournals(filtered);
  }, [searchQuery, selectedDate, journals]);

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <section className="mt-12 grid gap-6">
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white text-lg text-center font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/references"
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Explore Scientific References
        </Link>
      </section>

      {/* Journals Section */}
      <section className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Recent Journals
        </h2>

        {/* Search and Date Filter */}
        <div className="mb-6 w-full max-w-lg flex flex-col gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Journals List */}
        {filteredJournals.length > 0 ? (
          <ul className="space-y-4 w-full text-center">
            {filteredJournals.map((journal) => (
              <li key={journal.id}>
                <Link
                  to={`/blog/${journal.id}`}
                  className="text-blue-600 hover:underline text-lg"
                >
                  <div>
                    <strong>{journal.title}</strong>
                  </div>
                  <div className="text-gray-600">
                    Written By: {journal.written_by}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Published on:{" "}
                    {new Date(journal.created_at).toLocaleDateString()}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No journals match your search.</p>
        )}
      </section>
    </main>
  );
}
