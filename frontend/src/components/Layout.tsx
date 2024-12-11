// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isHomePage = location.pathname === "/";
//   const isAdminPage = location.pathname === "/admin";


//   const goToAdmin = () => {
//     navigate("/admin");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <nav
//         className={
//           !isHomePage
//             ? "bg-gray-800 text-white p-4 flex justify-between items-center"
//             : "bg-gray-800 text-white p-4 flex justify-center items-center" 
//          }
//       >
//         {!isHomePage && (
//           <>
//             <Link
//               to="/"
//               className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//             >
//               Home
//             </Link>
//             <button
//               onClick={goToAdmin}
//               className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
//             >
//               Admin
//             </button>
//           </>
//         )}
//         <button
//           onClick={goToAdmin}
//           className="px-4 py-2 bg-yellow-500 text-black justify-center rounded-lg hover:bg-yellow-600 transition"
//         >
//           Admin
//         </button>

//         {isAdminPage && (
//           <Link
//             to="/"
//             className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//           >
//             Home
//           </Link>
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


import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";
  const isAdminDashboardPage = location.pathname === "/admin-dashboard";

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
    return localStorage.getItem("admin_logged_in") === "true";
  });

  const handleLogin = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
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
        {/* Home page - Admin button centered */}
        {isHomePage && (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Admin
          </button>
        )}

        {/* Admin page - Home button centered */}
        {isAdminPage && (
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Home
          </Link>
        )}

        {/* Admin dashboard - Home on left, Logout on right */}
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

        {/* Other pages - Home on left, Admin or Logout/Login on right */}
        {!isHomePage && !isAdminPage && !isAdminDashboardPage && (
          <>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Home
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
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

      {/* Home page header */}
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
