const CAR_PRODUCT_FIELDS = `
  sys {
    id
    publishedAt
    firstPublishedAt
  }
  modelName
  carPrice
  carImage {
    url
    title
    description
    width
    height
  }
`;

export const CAR_PRODUCTS_QUERY = `
  query CarProducts($limit: Int!) {
    carProductCollection(limit: $limit, order: modelName_ASC) {
      total
      items {
        ${CAR_PRODUCT_FIELDS}
      }
    }
  }
`;

export const CAR_PRODUCT_BY_ID_QUERY = `
  query CarProductById($id: String!) {
    carProduct(id: $id) {
      ${CAR_PRODUCT_FIELDS}
    }
  }
`;
