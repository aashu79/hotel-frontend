import React from "react";
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { Button } from "../ui/button";

const AuthButtons: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return (
      <Link to="/profile">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <User size={18} />
          {user.name.split(" ")[0]}
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/signin">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <LogIn size={18} />
          Sign In
        </Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
