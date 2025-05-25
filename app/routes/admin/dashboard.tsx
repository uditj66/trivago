import { Header, StatsCard, TripCard } from "components";
import { dashBoardStats, user, allTrips } from "~/constants";
const { totalUsers, userJoined, totalTrips, tripsCreated, userRole } =
  dashBoardStats;
const dashboard = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title={`welcome to the dashboard  ${user?.username || "guest"}`}
        description=" Track activity and popular destinations in real time"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total users"
            total={totalUsers}
            currentMonthCount={userJoined.currentMonth}
            lastMonthCount={userJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users Today"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCard
                key={id}
                id={id.toString()}
                imageUrl={imageUrls[0]}
                name={name}
                location={itinerary[0].location ?? ""}
                tags={tags}
                price={estimatedPrice}
              />
            ))}
        </div>
      </section>
    </main>
  );
};

export default dashboard;
