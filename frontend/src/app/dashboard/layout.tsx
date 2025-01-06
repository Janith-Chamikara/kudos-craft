import Sidebar from './components/Sidebar';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
    </div>
  );
}
