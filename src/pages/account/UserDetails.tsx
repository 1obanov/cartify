import { Preloader } from "../../components/shared/Preloader";
import { UserPersonalDetails } from "../../components/user/UserPersonalDetails";
import { UserEmail } from "../../components/user/UserEmail";
import { UserPassword } from "../../components/user/UserPassword";
import { useShopContext } from "../../context/context";

const UserDetails = () => {
  const { state } = useShopContext();
  const { loadingUserDetails } = state;

  return loadingUserDetails ? (
    <Preloader />
  ) : (
    <div className="account__details">
      <h2 className="account__heading">Personal details</h2>
      <UserPersonalDetails />
      <UserEmail />
      <UserPassword />
    </div>
  );
};

export { UserDetails };
