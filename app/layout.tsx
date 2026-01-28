import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head></head>
      <body className="h-full">{children}</body>
    </html>
  );
}
