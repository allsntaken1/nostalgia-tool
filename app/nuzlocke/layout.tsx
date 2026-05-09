import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'nuzlocke.exe',
  icons: {
    icon: '/nuzlocke-icon.svg',
  },
};

export default function NuzlockeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
