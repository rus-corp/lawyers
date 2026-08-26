import { backendUrl } from "./_variables";


export const getDocumentSidebar = async (documentSlug: string) => {
  return backendUrl.get(`static-components/sidebar/${documentSlug}/`);
}


export const getDocumentInstruction = async (documentSlug: string) => {
  return backendUrl.get(`static-components/instruction/${documentSlug}/`);
}
