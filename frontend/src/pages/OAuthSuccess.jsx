import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    const username =
      params.get("username");

      const name =
  params.get("name");

    const role =
      params.get("role");

    if (token) {

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          name,
          role
        })
      );

      navigate("/dashboard");
    }

  }, [navigate]);

  return (
    <div className="text-white">
      Logging in...
    </div>
  );
}