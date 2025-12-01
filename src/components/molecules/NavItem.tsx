import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavItem({ to, children, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="text-foreground/80 hover:text-foreground font-medium transition-smooth"
      activeClassName="text-foreground font-bold"
    >
      {children}
    </NavLink>
  );
}
