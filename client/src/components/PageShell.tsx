import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("px-4 pt-3 pb-[88px] min-h-screen w-full max-w-md mx-auto", className)}>
      {children}
    </div>
  );
}
