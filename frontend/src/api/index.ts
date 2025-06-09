import { getCategories, getCategoryBySlug, getCategoryByParent, getSeacrhCategories } from "./category_api";
import { getDocument } from "./documents_api";
import { createBackUp } from "./form_api";
import { getNews, getNewsItem } from "./news_api";

export {
  getCategories, getCategoryBySlug,
  getCategoryByParent, getDocument,
  getNews, getNewsItem, createBackUp,
  getSeacrhCategories
}
