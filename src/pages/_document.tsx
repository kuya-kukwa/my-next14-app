import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v15-pagesRouter';
import type { DocumentHeadTagsProps } from '@mui/material-nextjs/v15-pagesRouter';

export default function Document(props: DocumentHeadTagsProps) {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = documentGetInitialProps;
