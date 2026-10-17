import { Outlet, useLocation } from "react-router-dom";
import { Preloader } from "../../components/shared/Preloader";
import { useShopContext } from "../../context/context";
import UserMenu from "./component/UserMenu";

const UserAccount = () => {
  const { state } = useShopContext();
  const { userDetails, loadingUserDetails } = state;
  const location = useLocation();

  return loadingUserDetails ? (
    <Preloader />
  ) : (
    <div className="section account">
      <div className="container">
        <div className="account__wrapper">
          <UserMenu />
          <div className="account__content">
            {location.pathname === "/account" && (
              <div className="account__intro">
                <h2>
                  Welcome, {userDetails?.firstName} {userDetails?.lastName}!
                </h2>
                <p>
                  We're glad to have you with us. <br /> Here, you can manage
                  your orders, personal data, and other account-related
                  information.
                </p>
                <span>Member ID: {userDetails?.uid}</span>
              </div>
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserAccount };
