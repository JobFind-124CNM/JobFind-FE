import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
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
              to="/about"
              className="text-sm font-medium hover:text-primary"
            >
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
            <Button variant="default">Register</Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Login
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
