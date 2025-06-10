export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
    const base = "inline-block px-3 py-1 rounded-full text-sm font-medium";
    const styles = {
      default: "bg-gray-200 text-gray-800",
      destructive: "bg-red-500 text-white",
    };
    return <span className={`${base} ${styles[variant] || styles.default}`}>{children}</span>;
  }
  