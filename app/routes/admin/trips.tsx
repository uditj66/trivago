import { Header, TripCard } from "components";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/tripsrelated";
import type { Route } from "./+types/trips";
import { parseTripData } from "~/lib/utils";
import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { useState } from "react";
// SSR =>code working on server so that's why we don't use useLocation or useParams()and useSearchParams()
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  // server side way of extracting url
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;
  const { trips, total } = await getAllTrips(limit, offset);
  return {
    allTrips: trips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};
const trips = ({ loaderData }: Route.ComponentProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") ?? "1");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(`page=${page}`); //also works
    // setSearchParams({page:String(page)}); => recommended
  };
  const allTrips = loaderData.allTrips as Trip[] | [];
  return (
    <main className="wrapper all-users">
      <Header
        title="Trips "
        description="View and Edit AI-generated travel plans"
        ctaText="Create-A-Trip"
        ctaUrl="/trips/create"
      />

      <section className="">
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>
        <div className="trip-grid mb-4">
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              interests,
              travelStyle,
              estimatedPrice,
              country,
            }) => (
              <TripCard
                key={id}
                id={id}
                name={name}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
                imageUrl={imageUrls[0]}
                location={country}
              />
            )
          )}
        </div>
        <PagerComponent
          cssClass="!mb-4"
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
        />
      </section>
    </main>
  );
};

export default trips;
