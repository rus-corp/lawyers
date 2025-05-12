import { backendUrl } from "./_variables";

export const getDocumentsList = async () => {
  try {
    const responsse = await backendUrl.get('categories/documents')
    return responsse;
  } catch (error) {
    console.error(error);
  }
}