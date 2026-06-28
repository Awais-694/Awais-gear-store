// app/admin/layout.js
export default function AdminConsoleLayout({ children }) {
  return (
    <div className="min-h-[70vh] py-4">
      {children}
    </div>
  );
}