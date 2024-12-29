// 'use client';

import React, { ReactNode } from 'react';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Happy Birthday User Management',
  description: 'Manage happy birthday user efficiently.',
};

interface LayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: LayoutProps) {

  return (
    <html lang="en">
      <body>
          <div className="flex min-h-screen">            
            <div className="flex-1 p-0 overflow-auto">
              <AuthProvider>
                {children}
              </AuthProvider>
            </div>
          </div>
      </body>
    </html>
  );
}
