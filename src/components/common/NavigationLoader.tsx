"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/components/common/Spinner";

export default function NavigationLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );
}
