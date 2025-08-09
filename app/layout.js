export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:,"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
