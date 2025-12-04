import React from 'react';
import { Layout } from '../Dashboard/Layout';
import { Sidebar } from '../Sidebar/Sidebar';

export function LoadingState() {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 bg-[#f4f5f7] p-4 sm:p-8 sm:pr-20">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </main>
    </Layout>
  );
}