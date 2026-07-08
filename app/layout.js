import "./globals.css";

export const metadata = {
  title: "Alberta Cancer Navigator",
  description:
    "Find which Alberta cancer centre handles a diagnosis, referral pathway basics, and matching clinical trials. Not medical advice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
