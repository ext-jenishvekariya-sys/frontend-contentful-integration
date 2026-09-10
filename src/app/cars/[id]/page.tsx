import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/contentful";
import { CAR_PRODUCT_BY_ID_QUERY } from "@/lib/queries";
import type { CarProductResponse } from "@/lib/types";
import { PreviewBanner } from "@/components/PreviewBanner";

export default async function CarProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { isEnabled: preview } = await draftMode();

  const data = await fetchGraphQL<CarProductResponse>(CAR_PRODUCT_BY_ID_QUERY, {
    variables: { id },
    preview,
  });

  const car = data.carProduct;
  if (!car) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <PreviewBanner active={preview} />

      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        &larr; Back to all cars
      </Link>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
        <div className="relative h-80 w-full bg-neutral-100">
          {car.carImage ? (
            <Image
              src={`${car.carImage.url}?w=1200&h=700&fit=fill`}
              alt={car.carImage.description || car.modelName || "Car product"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-semibold">
            {car.modelName ?? "Untitled model"}
          </h1>
          {typeof car.carPrice === "number" && (
            <p className="mt-2 text-xl text-neutral-600">
              ${car.carPrice.toLocaleString()}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-neutral-500">
            <div>
              <dt className="font-medium text-neutral-700">Entry ID</dt>
              <dd>{car.sys.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-700">First published</dt>
              <dd>
                {car.sys.firstPublishedAt
                  ? new Date(car.sys.firstPublishedAt).toLocaleString()
                  : "Not published yet"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
