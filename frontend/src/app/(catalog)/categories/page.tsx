import type { Metadata } from "next";

import { getPageMeta } from "@/api";



export async function generateMetadata(): Promise<Metadata> {
  console.log('categ meta')
  const response = await getPageMeta('categories')
  console.log(response)

  return {
    alternates: {canonical: 'https://pravo-dok.ru/categories'},
    title: response?.title || "Документы",
    description: response?.description,
    keywords: response?.keywords,
  };
}



export default function MainCategoryPage() {

  return(
    <></>
  );
}