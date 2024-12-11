// import React from "react";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function References() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Scientific References
        </h1>
        <p className="text-lg text-gray-600">
          Explore trusted resources to enhance your understanding of inorganic
          chemistry.
        </p>
      </header>
      <section className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <ul className="space-y-4">
          <li>
            <a
              href="https://pubs.acs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <span className="mr-2 text-xl">🔗</span>
              ACS Publications
            </a>
          </li>
          <li>
            <a
              href="https://open.uci.edu/courses/chem_107_inorganic_chemistry.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <span className="mr-2 text-xl">🔗</span>
              UCI Irvine Inorganic Chemistry Lectures
            </a>
          </li>
          <li>
            <a
              href="https://drive.google.com/file/d/14e_hsGNoV1dMxeBeoJX_5kHfuE1uRJGZ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <span className="mr-2 text-xl">🔗</span>
              Inorganic Chemistry Lab Book
            </a>
          </li>
          <li>
            <a
              href="https://go.openathens.net/redirector/ucf.edu?url=https%3A%2F%2Facademic.oup.com%2Fbook%2F40812"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <span className="mr-2 text-xl">🔗</span>
              Help with lab reports - Must sign in through UCF Or any other
              accredited University
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
