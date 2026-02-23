import "./globals.css";

export const metadata = {
  title: "Cooli Demo",
  description: "A simple task manager deployed with Coolify",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
