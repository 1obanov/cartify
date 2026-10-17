import { useState } from "react";

const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    togglePassword,
  };
};

export { usePasswordVisibility };
