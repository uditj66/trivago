import { calculateTrendPercentage, cn } from "~/lib/utils";

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCardProps) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  /* 
    It declares a constant variable named isDecrement.

    It assigns isDecrement the boolean value resulting from checking if the variable trend is strictly equal to the string "decrement".

    If trend equals "decrement", then isDecrement will be true; otherwise, it will be false 
    */

  const isDecrement = trend === "decrement";
  return (
    <div>
      <article className="stats-card ">
        <h3 className="text-base font-medium">{headerTitle}</h3>
        <div className="content">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-semibold">{total}</h2>
            <div className="flex items-center gap-2">
              <figure className="flex items-center gap-1">
                <img
                  src={`/assets/icons/${
                    isDecrement ? "arrow-down-red.svg" : "arrow-up-green.svg"
                  }`}
                  className="size-5"
                  alt="arrow"
                />
                <figcaption
                  className={cn(
                    "text-sm font-medium",
                    isDecrement ? "text-red-500" : "text-success-700"
                  )}
                >
                  {Math.round(percentage)}%
                </figcaption>
              </figure>
              <p className="text-sm font-medium text-gray-100 truncate">
                vs lastMonth
              </p>
            </div>
          </div>
          <img
            className="xl:w-32  w-full h-full md:h-32"
            alt="trend-graph"
            src={`/assets/icons/${
              isDecrement ? "decrement.svg" : "increment.svg"
            }`}
          />
        </div>
      </article>
    </div>
  );
};

export default StatsCard;
