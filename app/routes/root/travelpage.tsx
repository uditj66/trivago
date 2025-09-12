import { Link, type LoaderFunctionArgs, useSearchParams } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { cn, parseTripData } from "~/lib/utils";
import { Header, TripCard } from "../../../components";
import { getAllTrips } from "~/appwrite/tripsrelated";
import type { Route } from "../../../.react-router/types/app/routes/admin/+types/trips";
import { useState } from "react";
import { getUser } from "~/appwrite/authrelated";
import { PagerComponent } from "@syncfusion/ej2-react-grids";
import FeaturedDestination from "components/FeturedDestination";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const [user, { trips, total }] = await Promise.all([
    getUser(),
    getAllTrips(limit, offset),
  ]);

  // We are getting array of documents from trips-collection and then map each trip by destructuring the each property of trip so that we can use these properties and returning a new object called allTrips with only three properties id,imageUrls and tripDetails as all other properties of trip stored in database is not needed so that's why created new object. The ...parseTripDetails is just doing JSON.parse(tripDetails)so the string stored in tripDetails can be converted into JSON object so that we can use it on frontend

  return {
    allTrips: trips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
  const alltrips = loaderData.allTrips as Trip[] | [];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(`page=${page}`); //also works
    // setSearchParams({ page: String(page) }); recommended
  };

  return (
    <main className="flex flex-col">
      <section className="travel-hero">
        <div>
          <section className="wrapper">
            <article>
              <h1 className="p-72-bold text-dark-100">
                Plan Your Trip with Ease
              </h1>

              <p className="text-dark-100">
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </p>
            </article>

            <Link to="#trips">
              <ButtonComponent
                type="button"
                className="button-class !h-11 !w-full md:!w-[240px]"
              >
                <span className="p-16-semibold text-white">Get Started</span>
              </ButtonComponent>
            </Link>
          </section>
        </div>
      </section>

      <section className="pt-20 wrapper flex flex-col gap-10 h-full">
        <Header
          title="Featured Travel Destinations"
          description="Check out some of the best places you visit around the world"
        />
        <div className="featured">
          <article>
            <FeaturedDestination
              bgImage="bg-card-1"
              containerClass="h-1/3 lg:h-1/2"
              bigCard
              title="Barcelona's FootBall"
              rating={4.2}
              activityCount={27}
            />

            <div className="travel-featured">
              <FeaturedDestination
                bgImage="bg-card-2"
                bigCard
                title="London's Romance"
                rating={4.5}
                activityCount={87}
              />
              <FeaturedDestination
                bgImage="bg-card-3"
                bigCard
                title="Australia's Coral Reefs "
                rating={4.9}
                activityCount={150}
              />
            </div>
          </article>

          <div className="flex flex-col gap-[30px]">
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-4"
              title="Spain's La-Tomatino"
              rating={4.5}
              activityCount={50}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-5"
              title="Japan's Fugiama"
              rating={5}
              activityCount={150}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-6"
              title="Italy's Pizzas"
              rating={4.2}
              activityCount={250}
            />
          </div>
        </div>
      </section>

      <section id="trips" className="py-20 wrapper flex flex-col gap-10">
        <Header
          title="Handpicked Trips"
          description="Browse well-planned trips designs for your travel style"
        />

        <div className="trip-grid">
          {alltrips.map(
            ({
              id,
              name,
              imageUrls,
              location,
              itinerary,
              interests,
              travelStyle,
              estimatedPrice,
              country,
            }) => (
              <TripCard
                key={id}
                id={id}
                name={name}
                imageUrl={imageUrls[0]}
                location={country}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
        </div>

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>

      <footer className="h-28 bg-white">
        <div className="wrapper footer-container">
          <Link to="/">
            <img
              src="/assets/icons/logo.svg"
              alt="logo"
              className="size-[30px]"
            />
            <h1>TriVago</h1>
          </Link>

          <div>
            {["Terms & Conditions", "Privacy Policy"].map((item) => (
              <Link to="/" key={item}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
};
export default TravelPage;
