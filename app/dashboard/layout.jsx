import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-dvh bg-[#F7F7FB] font-roboto pb-[88px]">
      {children}
      <SellerProcessBottomNav />
    </div>
  );
}

