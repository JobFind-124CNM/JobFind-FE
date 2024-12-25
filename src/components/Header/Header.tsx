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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/userSlice";
import { RootState } from "@/store/store";
import api from "@/utils/api";
import { Role } from "@/models/role.interface";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isHr, setIsHr] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
      if (currentUser.roles) {
        checkRole(currentUser.roles);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const checkRole = (roles: Role[]) => {
    const isAdmin = roles.some((role) => role.name.toUpperCase() === "ADMIN");
    const isHr = roles.some((role) => role.name.toUpperCase() === "HR");
    const isUser = roles.some((role) => role.name.toUpperCase() === "USER");

    setIsHr(isHr);
    setIsUser(isUser);
    setIsAdmin(isAdmin);
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
          <Link
            to="/companies"
            className="text-sm font-medium hover:text-primary"
          >
            Companies List
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
                    {isHr && (
                      <DropdownMenuItem
                        className="cursor-pointer font-semibold"
                        onClick={() => navigate("/admin/hr/posts")}
                      >
                        Management
                      </DropdownMenuItem>
                    )}

                    {isAdmin && (
                      <DropdownMenuItem
                        className="cursor-pointer font-semibold"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        Management
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/applicaiton-history")}
                    >
                      Post Applied
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {isUser && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/company-register")}
                      >
                        Company Register
                      </DropdownMenuItem>
                    )}
                    {isHr && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/my-company")}
                      >
                        My Company
                      </DropdownMenuItem>
                    )}
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
