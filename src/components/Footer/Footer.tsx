import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#010B1D] text-white pt-16 pb-8">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-6">ABOUT US</h3>
            <p className="text-gray-400">
              Heaven frucvitful doesn't cover lesser dvsays appear creeping
              seasons so behold.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">CONTACT INFO</h3>
            <div className="space-y-4 text-gray-400">
              <p>Address :Your address goes here, your demo address.</p>
              <p>Phone : +8880 44338899</p>
              <p>Email : info@colorlib.com</p>
            </div>
          </div>

          {/* Important Link */}
          <div>
            <h3 className="text-xl font-bold mb-6">IMPORTANT LINK</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  View Project
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimonial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Properties
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">NEWSLETTER</h3>
            <p className="text-gray-400 mb-4">
              Heaven fruitful doesn't over lesser in days. Appear creeping.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button variant="default">
                <Send />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div>
              <img src="/logo.png.webp" alt="Job Finder" className="h-12" />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <span className="text-4xl font-bold">5000+</span>
                  <p className="text-gray-400">Talented Hunter</p>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold">451</span>
                  <p className="text-gray-400">Talented Hunter</p>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold">568</span>
                  <p className="text-gray-400">Talented Hunter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
