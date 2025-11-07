import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    // Add `data-scroll-behavior="smooth"` so Next.js can preserve smooth scrolling
    // behavior during route transitions in future Next.js versions.
    <Html lang="en" data-scroll-behavior="smooth">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
