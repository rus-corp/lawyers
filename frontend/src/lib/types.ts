export interface Breadcrumb {
  title: string;
  url: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  url: string;
  breadcrumbs: Breadcrumb[];
  documents_count?: number | null;
}

export interface DocumentItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  url: string;
  category: Category;
}

export interface CategoryPathData {
  category: Category;
  document: DocumentItem | null;
}

export interface SidebarItem {
  id: number;
  text: string;
  sort_order: number;
}

export interface SidebarSection {
  id: number;
  title: string;
  section_type: string;
  sort_order: number;
  items: SidebarItem[];
}

export interface DocumentSidebar {
  id: number;
  sections: SidebarSection[];
}

export interface DocumentInstruction {
  id: number;
  title: string;
  description: string;
}

export interface NewsItem {
  id: number;
  title: string;
  text: string;
  slug: string;
  created_at: string;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

export type SearchKind = 'category' | 'section' | 'document';

export interface SearchItem {
  title: string;
  url: string;
  kind: SearchKind;
  context: string;
}

export interface CatalogDocument {
  id: number;
  title: string;
  url: string;
}

export interface CatalogSection {
  id: number;
  title: string;
  slug: string;
  url: string;
  documents: CatalogDocument[];
}

export interface CatalogCategory {
  id: number;
  title: string;
  slug: string;
  url: string;
  documentsCount: number;
  sections: CatalogSection[];
}

export interface OrderPayload {
  price?: number;
  user_email: string;
  description: string;
}

export interface FeedbackPayload {
  name: string;
  email: string;
  phone: string;
  text: string;
}
