import { backendUrl } from "./_variables";


export const getNews = async () => {
  try {
    const responsse = await backendUrl.get('news')
    return responsse;
  } catch (error) {
    console.error(error);
  }
}


export const getNewsItem = async (newsSLug: string) => {
  try {
    const responsse = await backendUrl.get(`news/${newsSLug}`)
    return responsse;
  } catch (error) {
    console.error(error);
  }
}