import './globals.css';

export const metadata = {
  title: 'Enkai Biophilic Portal',
  description: 'Nairobi B2B Urban Development Workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
