import { backendUrl } from "./_variables";


export const getDocument = async (categorySlug: string) => {
  try {
    const response = await backendUrl.get(`categories/documents/${categorySlug}/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}