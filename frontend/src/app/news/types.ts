export type Props = {
  params: {
    slug: string;
  }
}

export type NewsItemType = {
  id: number;
  title: string;
  text: string;
  img: string;
  created_at: string;
}