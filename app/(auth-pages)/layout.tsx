export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl w-full flex flex-col gap-12 items-center px-6 py-12 mx-auto">
      {children}
    </div>
  );
}
