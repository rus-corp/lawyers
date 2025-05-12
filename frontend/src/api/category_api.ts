import { backendUrl } from "./_variables";


export const getCategories = async () => {
  try {
    const response = await backendUrl.get("/categories/");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}


export const getCategoryBySlug = async (categorySlug: string) => {
  try {
    const response = await backendUrl.get(`/categories/${categorySlug}/`);
    return response;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
}



export const getCategoryByParent = async (categorySlug: string) => {
  try {
    const response = await backendUrl.get(`/categories/parent/${categorySlug}/`);
    return response;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
}