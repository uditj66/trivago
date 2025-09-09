import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trips";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { world_map } from "~/constants/world_map";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch(
    `https://restcountries.com/v3.1/all/?fields=name,latlng,maps,flags`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.map((country: any) => ({
    flag: country.flags.svg,
    name: country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps.openStreetMaps,
  }));
};
const allTrips = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData;
  // console.log(countries);
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    duration: 0,
    groupType: "",
    travelStyle: "",
    interest: "",
    budget: "",
  });
  const mapData = [
    {
      country: formData.country,
      color: "#EA3823",
      co_ordinates:
        countries.find((c: Country) => c.name === formData.country)
          .coordinates || [],
    },
  ];
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const myItemTemplate = (loaderdata: any) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 12px",
        gap: 12,
        fontSize: 14,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <img
        src={loaderdata.flag}
        alt={loaderdata.name}
        style={{ width: 28, height: 18, objectFit: "cover", borderRadius: 2 }}
      />
      <span>{loaderdata.name}</span>
    </div>
  );

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !formData.country ||
      !formData.duration ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget
    ) {
      setLoading(false);
      setError("Please provide values for all fields");
      return;
    }
    if (formData.duration <= 2 || formData.duration > 15) {
      setLoading(false);
      setError(
        "The duration must be greater than 2 days and less than 16 days"
      );
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/create-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          budgetType: formData.budget,
          interests: formData.interest,
          travelStyle: formData.travelStyle,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else {
        console.error("Failed to generate trip 👎");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }

    setLoading(true);
    setError(null);
  };
  return (
    <main className="flex flex-col gap-10 wrapper pb-20">
      <Header
        title="Add a New Trip"
        description="view and edit AI-generated travel plan"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countries}
              fields={{ text: "name", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              itemTemplate={myItemTemplate}
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="duration"> Duration</label>
            <input
              type="number"
              name="duration"
              id="duration"
              placeholder="Trip duration in days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                className="combo-box"
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                // fields={{ text: "text", value: "value" }}
                placeholder={`Select ${key}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on World Map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full "></div>

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                className={cn("size-5", {
                  "animate-spin": loading,
                })}
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
              />
              <span className="p-16-semibold text-white">
                {loading
                  ? "Generating Please Wait..... "
                  : "Generate Trip With AI"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default allTrips;
