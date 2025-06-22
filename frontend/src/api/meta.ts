import { backendUrl } from "./_variables";


// export const getPageMeta = async (pageUrl: string) => {
//   try {
//     const response = await backendUrl.get(`meta/${pageUrl}`)
//     return response
//   } catch (error) {
//     console.error(error)
//   }
// }

type MetaDataResponse = {
  title: string;
  description: string;
  keywords: string;
};

export async function getPageMeta(pageUrl: string): Promise<MetaDataResponse | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/meta/${pageUrl}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}