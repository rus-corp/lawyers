import { CategoryListType } from "../categories/types";


export type DocumentsType = {
  id: number;
  title: string;
  file: string;
  slug: string;
  category: CategoryListType
}