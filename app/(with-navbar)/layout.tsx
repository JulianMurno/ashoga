import Sidebar from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-md:grid-cols-[250px_1fr] grid-rows-1 h-screen w-full">
    <Sidebar />
    {children}
    </div>
  );
}
