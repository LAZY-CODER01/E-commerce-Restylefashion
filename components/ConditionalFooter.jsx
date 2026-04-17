"use client";

import { usePathname } from "next/navigation";
import { Footer7 } from "@/components/ui/footer-7";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (
    pathname === "/seller/onboarding/type" ||
    pathname === "/seller/products/new" ||
    pathname === "/seller/boost"
  ) {
    return null;
  }
  return <Footer7 />;
}
