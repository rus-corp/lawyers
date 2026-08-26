import { backendUrl } from "./_variables";


export const getCategories = async (title?: string) => {
  let url;
  if (title) {
    url = `categories/?title=${encodeURIComponent(title)}`
  } else {
    url = "categories/"
  }
  try {
    const response = await backendUrl.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}


export const getCategoryBySlug = async (categorySlug: string) => {
  try {
    const response = await backendUrl.get(`categories/${categorySlug}/`);
    return response;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
}



export const getCategoryByParent = async (categorySlug: string) => {
  try {
    const response = await backendUrl.get(`categories/parent/${categorySlug}/`);
    return response;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
}


export const getSeacrhCategories = async (searchQuery: string) => {
  try {
    const response = await backendUrl.get(`categories/search/${encodeURIComponent(searchQuery)}/`);
    return response;
  } catch (error) {
    console.error("Error fetching search categories:", error);
    throw error;
  }
}
