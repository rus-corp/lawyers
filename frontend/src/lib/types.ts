export interface Breadcrumb {
  title: string;
  url: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  url: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  documents_count?: number | null;
}

export interface DocumentItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  url: string;
  description: string;
  pages: number | null;
  tags: string[];
  category: Category;
  // Present once the backend serves the page content; null while none is written.
  content?: DocumentContent | null;
  faq?: DocumentFAQ[];
}

export interface LawyerInfo {
  name: string;
  position: string;
  experience: string;
  photo: string | null;
}

// Texts written in the admin panel for one document page. Empty strings for empty fields.
export interface DocumentContent {
  seo_title: string;
  seo_description: string;
  h1: string;
  lead: string;
  when_needed: string;
  whats_inside: string;
  legal_basis: string;
  filing: string;
  attachments: string;
  preview: string;
  reviewed_by: LawyerInfo | null;
  // YYYY-MM-DD
  reviewed_at: string | null;
}

export interface DocumentFAQ {
  question: string;
  answer: string;
}

// An item of GET categories/<slug>/documents/
export interface CategoryDocument {
  id: number;
  title: string;
  slug: string;
  price: number;
  url: string;
  description: string;
  pages: number | null;
  tags: string[];
  section: Breadcrumb | null;
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

// GET settings/: what the admin sets for every page of the site.
export interface SiteSettings {
  metrika_id: string;
  yandex_verification: string;
  google_verification: string;
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
  tags?: string[];
}

export interface CatalogDocument {
  id: number;
  title: string;
  url: string;
  tags: string[];
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
