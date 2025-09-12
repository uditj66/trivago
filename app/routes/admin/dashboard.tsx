import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/authrelated";
// import { allTrips } from "~/constants";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboardrelatedstats";
import { getAllTrips } from "~/appwrite/tripsrelated";
import { parseTripData } from "~/lib/utils";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
} from "@syncfusion/ej2-react-grids";

/*

##Fake data earlier represented on dashboard
const { totalUsers, userJoined, totalTrips, tripsCreated, userRole } =
dashBoardStats;
*/

export const clientLoader = async () => {
  const [
    user,
    dashBoardStats,
    allUsersTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    getUser(),
    getUsersAndTripsStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsByTravelStyle(),
    getAllUsers(4, 0),
  ]);
  const allTrips = allUsersTrips.trips.map(
    ({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    })
  );

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount ?? Math.floor(Math.random() * 10),
  }));
  return {
    user,
    dashBoardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
};

const dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashBoardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));
  const userAndTrips = [
    {
      title: "Latest user Signups",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips Created",
    },
    {
      title: "Trips Based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];
  // const{totalTrips}=loaderData.dashBoardStats; one level more deep  destructuring

  return (
    <main className="dashboard wrapper">
      <Header
        title={`welcome to the dashboard  ${user?.name || "guest"}`}
        description=" Track activity and popular destinations in real time"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total users"
            total={dashBoardStats.totalUsers}
            currentMonthCount={dashBoardStats.usersJoined.currentMonth}
            lastMonthCount={dashBoardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashBoardStats.totalTrips}
            currentMonthCount={dashBoardStats.tripsCreated.currentMonth}
            lastMonthCount={dashBoardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users Today"
            total={dashBoardStats.userRole.total}
            currentMonthCount={dashBoardStats.userRole.currentMonth}
            lastMonthCount={dashBoardStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              imageUrl={trip.imageUrls[0]}
              name={trip.name!}
              location={trip.country!}
              tags={[trip.interests!, trip.travelStyle!]}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="USER Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71,132,238,0.3"
              border={{ width: 2, color: "#4784EE" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="TRIPS TRENDS"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="day"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
      <section className="user-trip wrapper">
        {userAndTrips.map(({ title, dataSource, field, headerText }, index) => (
          <div key={index} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>
            <GridComponent dataSource={dataSource} gridLines="None">
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Name"
                  width="150"
                  textAlign="Left"
                  template={(props: UserData) => (
                    <div className="flex items-center gap-1.5 px-4">
                      <img
                        src={props?.imageUrl}
                        alt="user"
                        className="rounded-full size-8 aspect-square"
                      />
                      <span>{props.name}</span>
                    </div>
                  )}
                />
                <ColumnDirective
                  field={field}
                  headerText={headerText}
                  width="50"
                  textAlign="Left"
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
};

export default dashboard;
