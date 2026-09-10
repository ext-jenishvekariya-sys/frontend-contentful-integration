const GRAPHQL_ENDPOINT = "https://graphql.contentful.com/content/v1/spaces";

type FetchGraphQLOptions = {
  variables?: Record<string, unknown>;
  preview?: boolean;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

/**
 * Calls Contentful's GraphQL Content API.
 * Uses the Content Preview API (draft + published content) when `preview`
 * is true, otherwise the Content Delivery API (published content only).
 */
export async function fetchGraphQL<T>(
  query: string,
  { variables, preview = false }: FetchGraphQLOptions = {},
): Promise<T> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const token = preview
    ? process.env.CONTENTFUL_CPA_TOKEN
    : process.env.CONTENTFUL_CDA_TOKEN;

  if (!spaceId || !token) {
    throw new Error(
      "Missing Contentful environment variables. Check CONTENTFUL_SPACE_ID and CONTENTFUL_CDA_TOKEN/CONTENTFUL_CPA_TOKEN in .env.local.",
    );
  }

  const url = `${GRAPHQL_ENDPOINT}/${spaceId}/environments/${environment}${preview ? "?preview=true" : ""
    }`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    // Draft content must never be cached; published content can be.
    cache: preview ? "no-store" : "force-cache",
  });

  console.log("url: ", url);
  console.log("res: ", res);

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(
      `Contentful GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`,
    );
  }

  if (!json.data) {
    throw new Error("Contentful GraphQL API returned no data.");
  }

  return json.data;
}
