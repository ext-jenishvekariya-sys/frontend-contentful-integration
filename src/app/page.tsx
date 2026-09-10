import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { fetchGraphQL } from "@/lib/contentful";
import { CAR_PRODUCTS_QUERY } from "@/lib/queries";
import type { CarProductCollectionResponse } from "@/lib/types";
import { PreviewBanner } from "@/components/PreviewBanner";

export default async function Home() {
  const { isEnabled: preview } = await draftMode();

  const data = await fetchGraphQL<CarProductCollectionResponse>(
    CAR_PRODUCTS_QUERY,
    { variables: { limit: 20 }, preview },
  );
  const cars = data.carProductCollection.items;
  console.log("DATA: ", data);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <PreviewBanner active={preview} />

      <h1 className="text-3xl font-semibold tracking-tight">Car Products</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Fetched from Contentful (space{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5">
          {process.env.CONTENTFUL_SPACE_ID}
        </code>
        ) via GraphQL, using the{" "}
        {preview ? "Content Preview API" : "Content Delivery API"}.
      </p>

      {cars.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
          No carProduct entries {preview ? "" : "published "}found. Add one in
          Contentful{preview ? "" : " and publish it"} to see it here.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <li key={car.sys.id}>
              <Link
                href={`/cars/${car.sys.id}`}
                className="block overflow-hidden rounded-xl border border-neutral-200 transition hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-neutral-100">
                  {car.carImage ? (
                    <Image
                      src={`${car.carImage.url}?w=600&h=400&fit=fill`}
                      alt={car.carImage.description || car.modelName || "Car product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-medium">
                    {car.modelName ?? "Untitled model"}
                  </h2>
                  {typeof car.carPrice === "number" && (
                    <p className="mt-1 text-neutral-600">
                      ${car.carPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
