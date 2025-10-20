import axios from "axios";
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
    console.log('Sending request to:', backendUrl.defaults.baseURL + `meta/${pageUrl}/`)
    const res = await backendUrl.get(
      `meta/${pageUrl}/`,
      {
        headers: {'Cache-Control': 'no-store'}
      }
    );
    console.log(res.status)
    if (res.status === 200) {
      
      return res.data;
    } else {
      console.error(`Error: Received status ${res.status}`);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}