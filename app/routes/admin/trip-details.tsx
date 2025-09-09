import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/tripsrelated";
import type { Route } from "./+types/trip-details";
import { Header, InfoPill, TripCard } from "components";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) {
    throw new Error("TripId not found");
  }
  const [trip, alltrips] = await Promise.all([
     getTripById(tripId),
     getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: alltrips.trips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
      /*
      # Nullish coalescing =>??
      It only falls back if the left-hand value is null or undefined.

      #|| means OR
      It uses the right-hand value ([]) if the left-hand value is falsy.
      
     # Falsy values in JavaScript:
      👉 false, 0, "", null, undefined, NaN

     #  Since imageUrls is supposed to be an array, the only “bad” cases are null or undefined.
     If it’s [], that’s already fine.
     If it’s "" or 0, that would be invalid data anyway.

    👉 So best practice here is:
      */
    })),
  };
};

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  // console.log(loaderData.tripDetails);
  /* 
  as we store the trip details in json formatted string in database ,So we need to parse it to json before it is being used furthur 
  */
  const tripData = parseTripData(loaderData.trip.tripDetails);
  console.log(tripData);
  const imageUrls = loaderData.trip?.imageUrls || [];
  const {
    id,
    name,
    duration,
    location,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    payment_link,
    country,
  } = tripData || {};
  const allTrips = loaderData.allTrips as Trip[] | [];
  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-100 !text-pink-800" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: interests, bg: "!bg-success-50 !text-success-500" },
    { text: budget, bg: "!bg-navy-100 !text-navy-800" },
  ];
  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit", items: bestTimeToVisit },
    { title: "Weather Info", items: weatherInfo },
  ];
  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trips Details"
        description="View and edit AI -generated travel Plans"
      />
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-200">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration}days`}
              image={"/assets/icons/calendar.svg"}
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0)
                  .map((place: any) => place.location)
                  .join(",") || ""
              }
              image={"/assets/icons/location-mark.svg"}
            />
          </div>
        </header>
        <section className="gallery">
          {imageUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt="trip_image"
              className={cn(
                "w-full rounded-xl object-cover",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(pill.text)}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}
            <li className="mt-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!text-yellow-500 !bg-yellow-50"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        <section className="title">
          <article className="">
            <h3>
              {duration}-days | {country} | {travelStyle}
            </h3>
            <p>
              {budget} , {groupType} and {interests}
            </p>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>
        <p className="text-justify text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index) => (
            <li key={index}>
              <h3>
                {dayPlan.day}:{dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((todayPlan, index) => (
                  <li key={index}>
                    <span className=" flex-shrink-0 p-18-semibold">
                      {todayPlan.time}
                    </span>
                    <p className="flex-grow">{todayPlan.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {visitTimeAndWeatherInfo.map((element, index) => (
          <section key={index} className="visit">
            <div>
              <h3>{element.title}</h3>
              <ul>
                {element.items?.map((item, index) => (
                  <li key={index}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              country,
              interests,
              travelStyle,
              estimatedPrice,
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
      </section>
    </main>
  );
};

export default TripDetails;
