import { backendUrl } from "./_variables";

export const createBackUp = async (data: any) => {
  try {
    const response = await backendUrl.post('backup/', data);
    return response.data;
  } catch (error) {
    console.error("Error creating backup:", error);
    throw error;
  }
}
