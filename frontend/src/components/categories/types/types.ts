export type CategoryComponentProps = {
  categorySlug: string;
  beforeLevelClickedCategory: string
}


export type CategoryItemType = {
  id: number;
  title: string;
  slug: string;
  beforeLevelClickedCategory: string
  isActive: boolean
  isFind?: boolean | null
}

export type CategoryListType = {
  id: number,
  title: string,
  slug: string
}


export type CategoryType = {
  id: number;
  title: string;
  categorySlug: string;
  children?: CategoryType[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

export type MainCategoryProps = {
  clickedCategory: Function
}