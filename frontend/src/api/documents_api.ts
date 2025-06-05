import { backendUrl } from "./_variables";


export const getDocumentsList = async () => {
  try {
    const response = await backendUrl.get('categories/documents')
    return response.data;
  } catch (error) {
    console.error(error);
  }
}