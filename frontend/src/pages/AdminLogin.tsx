// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Hardcoded credentials
//     const adminUsername = "jacob.furst@ucf.edu";
//     const adminPassword = "Inorgo-2050!";

//     if (username === adminUsername && password === adminPassword) {
//       navigate("/admin-dashboard");
//     } else {
//       alert("Invalid username or password.");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
//       >
//         <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
//         <div className="mb-4">
//           <label className="block text-gray-700">Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </main>
//   );
// };

// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const sessionExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem(
          "session_expiration",
          sessionExpiration.toString()
        );
        navigate("/admin-dashboard");
      } else {
        const { message } = await response.json();
        setError(message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
