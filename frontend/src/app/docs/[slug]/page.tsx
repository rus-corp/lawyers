import { notFound, permanentRedirect } from 'next/navigation';
import { getDocumentBySlug } from '@/lib/server-api';

// Old document addresses redirect to the document's place in the catalog.
export default async function LegacyDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug);
  if (!document?.url) notFound();
  permanentRedirect(document.url);
}
