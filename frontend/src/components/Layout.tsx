// import React, { useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isHomePage = location.pathname === "/";
//   const isAdminPage = location.pathname === "/admin";
//   const isAdminDashboardPage = location.pathname === "/admin-dashboard";

//   const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
//     return localStorage.getItem("admin_logged_in") === "true";
//   });

//   useEffect(() => {
//     const adminSessionTimeout = setTimeout(() => {
//       if (isLoggedIn) {
//         handleLogout();
//         alert("Your session has expired. Please log in again.");
//       }
//     }, 15 * 60 * 1000); // 15 minutes in milliseconds

//     return () => clearTimeout(adminSessionTimeout); // Cleanup on component unmount
//   }, [isLoggedIn]);

//   const validateAdminSession = async () => {
//     try {
//       const response = await fetch("/api/admin-session", {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Session validation failed");
//     } catch (error) {
//       console.error("Admin session validation failed:", error);
//       handleLogout();
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       validateAdminSession();
//     }
//   }, [isLoggedIn]);

//   const handleLogin = () => {
//     navigate("/admin");
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("admin_logged_in");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <nav
//         className={
//           "bg-gray-800 text-white p-4 flex " +
//           (isHomePage
//             ? "justify-center items-center"
//             : isAdminPage
//             ? "justify-center items-center"
//             : isAdminDashboardPage
//             ? "justify-between items-center"
//             : "justify-between items-center")
//         }
//       >
//         {isHomePage && (
//           <button
//             onClick={handleLogin}
//             className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
//           >
//             Admin
//           </button>
//         )}

//         {isAdminPage && (
//           <Link
//             to="/"
//             className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//           >
//             Home
//           </Link>
//         )}

//         {isAdminDashboardPage && (
//           <>
//             <Link
//               to="/"
//               className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//             >
//               Home
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </>
//         )}

//         {!isHomePage && !isAdminPage && !isAdminDashboardPage && (
//           <>
//             <Link
//               to="/"
//               className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//             >
//               Home
//             </Link>
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   to="/admin-dashboard"
//                   className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
//                 >
//                   Admin Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleLogin}
//                 className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
//               >
//                 Admin
//               </button>
//             )}
//           </>
//         )}
//       </nav>

//       {isHomePage && (
//         <header className="text-center py-8">
//           <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
//             Inorganic Chemistry Blog
//           </h1>
//           <p className="text-lg text-gray-600">
//             Dive into the latest insights and resources for inorganic chemistry.
//           </p>
//         </header>
//       )}

//       <main className="flex-1">{children}</main>
//     </div>
//   );
// };

// export default Layout;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";
  const isAdminDashboardPage = location.pathname === "/admin-dashboard";

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const loggedIn = localStorage.getItem("admin_logged_in") === "true";
    const sessionExpiration = parseInt(
      localStorage.getItem("session_expiration") || "0",
      10
    );
    return loggedIn && Date.now() < sessionExpiration;
  });

  useEffect(() => {
    const extendSession = () => {
      const newExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
      localStorage.setItem("session_expiration", newExpiration.toString());
    };

    const handleActivity = () => {
      if (isLoggedIn) {
        extendSession();
      }
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const checkSessionExpiration = () => {
      const sessionExpiration = parseInt(
        localStorage.getItem("session_expiration") || "0",
        10
      );
      if (Date.now() >= sessionExpiration) {
        handleLogout();
        alert(
          "Your session has expired due to inactivity. Please log in again."
        );
      }
    };

    // Check session expiration every 1 minute
    const interval = setInterval(checkSessionExpiration, 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [isLoggedIn]);

  const handleLogin = () => {
    const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    localStorage.setItem("admin_logged_in", "true");
    localStorage.setItem("session_expiration", expiration.toString());
    setIsLoggedIn(true);
    navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("session_expiration");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav
        className={
          "bg-gray-800 text-white p-4 flex " +
          (isHomePage
            ? "justify-center items-center"
            : isAdminPage
            ? "justify-center items-center"
            : isAdminDashboardPage
            ? "justify-between items-center"
            : "justify-between items-center")
        }
      >
        {isHomePage && (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Admin
          </button>
        )}

        {isAdminPage && (
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Home
          </Link>
        )}

        {isAdminDashboardPage && (
          <>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}

        {!isHomePage && !isAdminPage && !isAdminDashboardPage && (
          <>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin-dashboard"
                  className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
              >
                Admin
              </button>
            )}
          </>
        )}
      </nav>

      {isHomePage && (
        <header className="text-center py-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Inorganic Chemistry Blog
          </h1>
          <p className="text-lg text-gray-600">
            Dive into the latest insights and resources for inorganic chemistry.
          </p>
        </header>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
