import type { Metadata } from "next";

import { getPageMeta } from "@/api";



export async function generateMetadata(): Promise<Metadata> {
  console.log('categ meta')
  const response = await getPageMeta('categories')
  console.log(response)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}



export default function MainCategoryPage() {

  return(
    <></>
  );
}