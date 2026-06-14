import {
  createContext,
  useState,
  useEffect,
} from "react";

export const AuthContext =
  createContext();

export default function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const username =
      localStorage.getItem("username");

    const role =
      localStorage.getItem("role");

    if (token && username) {
      setUser({
        username,
        role,
        token,
      });
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "role",
      data.role
    );

    localStorage.setItem(
      "username",
      data.username
    );

    setUser({
      username: data.username,
      role: data.role,
      token: data.token,
    });
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "username"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}