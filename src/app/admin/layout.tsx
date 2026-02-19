export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen w-full bg-[#0f0f17] text-white">
      <div className="w-full min-h-screen p-8">
        {children}
      </div>
    </section>
  );
}