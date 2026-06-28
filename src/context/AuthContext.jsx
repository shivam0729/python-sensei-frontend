import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

const tokenKey = import.meta.env.VITE_JWT_TOKEN_KEY || "ps_auth_token";

export const AuthProvider = ({
  children,
}) => {

  const [token, setToken] = useState(
    localStorage.getItem(tokenKey)
  );

  const login = (newToken) => {

    localStorage.setItem(
      tokenKey,
      newToken
    );

    setToken(newToken);
  };

  const logout = () => {

    localStorage.removeItem(
      tokenKey
    );

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);