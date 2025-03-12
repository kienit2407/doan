"use client";

import { useEffect } from "react";

// Component này đảm bảo Bootstrap JavaScript chỉ được load ở client-side
export default function BootstrapProvider({ children }) {
  useEffect(() => {
    // Import Bootstrap JS chỉ ở client-side
    const loadBootstrap = async () => {
      try {
        await import("bootstrap/dist/js/bootstrap.bundle.min.js");
      } catch (error) {
        console.error("Error loading Bootstrap JS:", error);
      }
    };

    loadBootstrap();
  }, []);

  return <>{children}</>;
}
