import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { User } from "@/models/user.interface";
import api from "@/utils/api";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/store/userSlice";
import { Role } from "@/models/role.interface";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>();
  const [isAdminOrHr, setIsAdminOrHr] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setIsAuthenticated(true);
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const user: User = response.data.data;
          setCurrentUser(user);
          dispatch(setUser(user));

          if (user.roles) {
            checkRole(user.roles);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          setIsAuthenticated(false);
          localStorage.removeItem("access_token");
        });
    }
  }, [dispatch]);

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const checkRole = (roles: Role[]) => {
    const isAdmin = roles.some((role) => role.name.toUpperCase() === "ADMIN");
    const isHr = roles.some((role) => role.name.toUpperCase() === "HR");

    setIsAdminOrHr(isAdmin || isHr);
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access_token");

    api
      .get("/auth/logout", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setIsAuthenticated(false);

        localStorage.removeItem("access_token");
        setCurrentUser(undefined);
        dispatch(logout());

        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container max-w-[1320px] mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            <img
              src="/logo.png.webp"
              alt="Job Finder Logo"
              className="h-12 w-36"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-12">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/jobs" className="text-sm font-medium hover:text-primary">
            Find a Jobs
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/page" className="text-sm font-medium hover:text-primary">
            Page
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium">
                Hello, {currentUser?.username}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={currentUser?.avatar}
                      alt={currentUser?.username}
                    />
                    <AvatarFallback>
                      {currentUser?.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {isAdminOrHr && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/admin/posts")}
                      >
                        Management
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/company-register")}
                    >
                      Company Register
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/applicaiton-history")}
                    >
                      Post Applied
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-rose-600"
                    onClick={handleLogout}
                  >
                    Logout
                    <DropdownMenuShortcut>
                      <LogOut className="w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="default" onClick={handleRegister}>
                Register
              </Button>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
