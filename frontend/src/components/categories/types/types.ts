export type CategoryComponentProps = {
  categorySlug: string;
}


export type CategoryItemType = {
  id: number;
  title: string;
  slug: string;
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