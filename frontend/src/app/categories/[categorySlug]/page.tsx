import type { Metadata } from "next";

import { getPageMeta } from "@/api";

type Props = {
  params: { slug: string };
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  console.log('category slug meta', params.slug)
  if (!params.slug) return {}
  const response = await getPageMeta(`categories/${params.slug}`)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}





export default function CategoryPage() {
  return(
    <></>
  );
}