import { ReactNode, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, FileText, CreditCard, Package, AlertCircle, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navContainerRef.current) {
      const activeLink = navContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeLink) {
        const container = navContainerRef.current;
        const scrollLeft = activeLink.offsetLeft - container.offsetWidth / 2 + activeLink.offsetWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [location.pathname]);

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Building2, label: "Propiedades", path: "/properties" },
    { icon: FileText, label: "Contratos", path: "/contracts" },
    { icon: CreditCard, label: "Pagos", path: "/payments" },
    { icon: Package, label: "Inventario", path: "/inventory" },
    { icon: AlertCircle, label: "Deudas", path: "/debts" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-display font-bold text-foreground">RENTIA</h1>
          </div>
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong">
        <div className="container max-w-7xl mx-auto px-2">
          <div
            ref={navContainerRef}
            className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar gap-4"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-active={isActive}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[70px]",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;