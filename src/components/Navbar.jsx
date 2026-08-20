import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}ASN_logo_full.png`}
              alt="Arizona Sustainability Navigator"
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/resource" className="text-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/events" className="text-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
              Events
            </Link>
            <Link to="/insights" className="text-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
              Insights
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-xs tracking-[0.2em] uppercase text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors bg-[hsl(var(--muted-foreground))]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-xs tracking-[0.2em] uppercase text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors bg-[hsl(var(--muted-foreground))]"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-foreground text-xs tracking-[0.2em] uppercase">

            MENU
          </button>
        </div>
        <div className="h-[0.5px] bg-border" />
      </nav>

      {menuOpen &&
      <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="relative w-[80%] max-w-sm bg-foreground h-full flex flex-col p-10 animate-in slide-in-from-right">
            <button
            onClick={() => setMenuOpen(false)}
            className="self-end text-background mb-12">

              <X size={24} />
            </button>
            <div className="flex flex-col gap-8">
              {[
            { label: "Home", to: "/" },
            { label: "Resources", to: "/resource" },
            { label: "Events", to: "/events" },
            { label: "Insights", to: "/insights" },
            { label: "Profile", to: "/profile" }].
            map((item) =>
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="text-background font-heading text-3xl hover:text-primary transition-colors">

                  {item.label}
                </Link>
            )}
            </div>
            <div className="mt-auto">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="inline-block text-primary text-xs tracking-[0.2em] uppercase border border-primary px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-block text-primary text-xs tracking-[0.2em] uppercase border border-primary px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors">

                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      }
    </>);

}
