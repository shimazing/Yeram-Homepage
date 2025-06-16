import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Church, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "홈", labelEn: "Home" },
    { path: "/services", label: "예배안내", labelEn: "Services" },
    { path: "/announcements", label: "교회소식", labelEn: "News" },
    { path: "/gallery", label: "사진첩", labelEn: "Gallery" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-church-navy rounded-full flex items-center justify-center">
              <Church className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-church-navy">예람교회</h1>
              <p className="text-xs text-gray-500">Yerim Church</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-church-navy border-b-2 border-church-gold"
                    : "text-gray-600 hover:text-church-navy"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-church-navy" size={20} />
            ) : (
              <Menu className="text-church-navy" size={20} />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded ${
                    isActive(item.path)
                      ? "text-church-navy font-medium bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
