import { backendUrl } from "./_variables";


export const getDocumentsList = async (title?: string) => {
  let url;
  if (title) {
    url = `categories/documents/?title=${encodeURIComponent(title)}`
  } else {
    url = 'categories/documents'
  }
  try {
    const response = await backendUrl.get(url)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}