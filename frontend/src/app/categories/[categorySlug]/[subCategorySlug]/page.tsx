import type { Metadata } from "next";

import { getPageMeta } from "@/api";

type Props = {
  params: {
    mainCategorySlug: string;
    categorySlug: string
  };
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
  const response = await getPageMeta(`categories/${params.mainCategorySlug}/${params.categorySlug}`)
  if (!params.mainCategorySlug || !params.categorySlug) return {}
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}


export default function SubCategoryPage() {
  return(
    <></>
  );
}