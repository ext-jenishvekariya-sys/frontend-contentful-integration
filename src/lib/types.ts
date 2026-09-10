export type ContentfulAsset = {
  url: string;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
};

export type CarProduct = {
  sys: {
    id: string;
    publishedAt: string | null;
    firstPublishedAt: string | null;
  };
  modelName: string | null;
  carPrice: number | null;
  carImage: ContentfulAsset | null;
};

export type CarProductCollectionResponse = {
  carProductCollection: {
    total: number;
    items: CarProduct[];
  };
};

export type CarProductResponse = {
  carProduct: CarProduct | null;
};
