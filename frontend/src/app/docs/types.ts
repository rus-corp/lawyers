export type DocProps = {
  params: {
    slug: string
  }
}


export type DocumentType = {
  id: number;
  title: string;
  slug: string;
  price: number;
  url: string;
  category: {
    id: number;
    title: string;
    slug: string;
  }
}