import { onAuthStateChanged } from "firebase/auth";
import { BookUser, LogOut, Package2, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { auth } from "../../../firebase";

export default function UserMenu() {
  const navigate = useNavigate();

  // SignOut handler function
  const handleSignOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      } else {
        console.error("Unknown logout error:", error);
      }
    }
  };

  // If the user is not authenticated, navigate to the homepage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="account-menu">
      <div className="account-menu__heading">
        <h3>Your account</h3>
        <button
          type="button"
          className="account-menu__link"
          onClick={handleSignOut}
        >
          <LogOut strokeWidth="1.2" size="24" />
          Sign Out
        </button>
      </div>
      <nav className="account-menu__nav">
        <ul className="account-menu__list">
          <li className="account-menu__item">
            <NavLink
              to="/account/details"
              className={({ isActive }) =>
                `account-menu__link ${isActive ? "active" : ""}`
              }
            >
              <UserRound strokeWidth="1.2" size="20" />
              Details
            </NavLink>
          </li>
          <li className="account-menu__item">
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                `account-menu__link ${isActive ? "active" : ""}`
              }
            >
              <Package2 strokeWidth="1.2" size="20" />
              Orders
            </NavLink>
          </li>
          <li className="account-menu__item">
            <NavLink
              to="/account/addresses"
              className={({ isActive }) =>
                `account-menu__link ${isActive ? "active" : ""}`
              }
            >
              <BookUser strokeWidth="1.2" size="20" />
              Addresses
            </NavLink>
          </li>
          <hr className="divider" />
          <li className="account-menu__item">
            <button
              type="button"
              className="account-menu__link"
              onClick={handleSignOut}
            >
              <LogOut strokeWidth="1.2" size="20" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
