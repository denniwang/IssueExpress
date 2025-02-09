import "./globals.css";

export const metadata = {
  title: "IssueExpress",
  description: "The future of project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-micro5" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Micro+5&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
