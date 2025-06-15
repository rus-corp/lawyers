
export default function ArticleContent({ htmlContent}: {htmlContent: string}) {
  return(
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}