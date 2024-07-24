/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import mainbg from "./assets/mainbg.avif";
import {
  GlobeAmericasIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { getCityData, getFiveDaysForecast } from "./store/slices/weatherSlice";
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureHigh, FaWind } from "react-icons/fa";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { DNA } from "react-loader-spinner";

function App() {
  const dispatch = useDispatch();
  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  const [city, setCity] = useState("");
  const unit = "metric";

  // main loadings state
  const [loadings, setLoadings] = useState(true);

  // check if any of redux loading state is still true
  const allLoadings = [citySearchLoading, forecastLoading];

  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  // fetch  All data

  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      console.log(res);
      if (!res.payload.error) {
        dispatch(
          getFiveDaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };

  // handle city search
  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  // function to filter forecast data based on the time of the first object
  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <div>
        <form onSubmit={handleCitySearch}>
          <div className="p-6 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-400"
                />
              </div>
              <input
                name="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City name"
                readOnly={loadings}
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              />
            </div>
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-600"
            >
              <GlobeAmericasIcon
                aria-hidden="true"
                className="-ml-0.5 h-5 w-5 text-gray-300"
              />
              <p className="-ml-0.5 h-5 w-5 text-white">Go</p>
            </button>
          </div>
        </form>
        {loadings ? (
          <div className="flex justify-center items-center min-h-screen">
            <DNA
              visible={true}
              height="150"
              width="150"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <>
            {citySearchData && citySearchData.error ? (
              <div className="error-msg">{"Invalid City Name"}</div>
            ) : (
              <>
                {forecastError ? (
                  <div className="error-msg">{forecastError}</div>
                ) : (
                  <>
                    {citySearchData && citySearchData.data ? (
                      <div className="p-6 flex flex-col md:flex-row rounded-md shadow-sm">
                        <div
                          className="flex-grow items-stretch focus-within:z-10  p-6 rounded-md shadow-sm bg-gray-400"
                          style={{
                            background:
                              "linear-gradient(to bottom, #ffffff, #d1d5db)",
                          }}
                        >
                          <h2 className="text-gray-500 text-2xl">
                            Current Weather
                          </h2>
                          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 p-4">
                            <div className="shadow-md w-full md:w-1/2 p-2 h-72 rounded">
                              <p className="text-blue-700 text-lg font-semibold flex gap-3 items-center">
                                <FaLocationDot className="w-8 h-8 text-gray-600" />{" "}
                                <span>{citySearchData.data.name}</span>
                              </p>
                              <div className="flex justify-center items-center">
                                <img
                                  src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                                  alt="icon"
                                />
                                <p className="text-2xl">
                                  {citySearchData.data.main.temp}&deg; C
                                </p>
                              </div>
                              <p className="text-lg text-gray-600 text-center mt-8">
                                {citySearchData.data.weather[0].description}
                              </p>
                            </div>
                            <div
                              className="shadow-md w-full md:w-1/2 p-2 rounded bg-gray-400"
                              style={{
                                background:
                                  "linear-gradient(to bottom, #ffffff, #d1d5db)",
                              }}
                            >
                              <div className="lg:pl-44 pl-16">
                                <p className=" text-lg font-semibold flex gap-4 ">
                                  <span>
                                    <FaTemperatureHigh className="w-8 h-8 text-gray-600" />{" "}
                                  </span>
                                  Feels Like
                                  <span className="text-blue-700">
                                    {citySearchData.data.main.feels_like}
                                  </span>
                                  <span className="text-blue-700">&deg;C</span>
                                </p>
                                <div className="justify-center items-center">
                                  <div className="mt-6 flex w-full flex-none gap-x-4  px-6 pt-6">
                                    <dt className="flex-none">
                                      <WiHumidity
                                        aria-hidden="true"
                                        className="h-8 w-8 text-gray-400"
                                      />
                                    </dt>
                                    <dd className="text-sm font-medium  text-gray-900">
                                      <span className="mr-4">Humidity</span>
                                      <span className="text-blue-500 ml-6">
                                        {citySearchData.data.main.humidity}%
                                      </span>
                                    </dd>
                                  </div>
                                  <div className="mt-6 flex w-full flex-none gap-x-4  px-6 pt-6">
                                    <dt className="flex-none">
                                      <FaWind
                                        aria-hidden="true"
                                        className="h-8 w-8 text-gray-400"
                                      />
                                    </dt>
                                    <dd className="text-sm font-medium leading-6 text-gray-900">
                                      <span className="mr-4">Wind</span>
                                      <span className="text-blue-500 ml-12">
                                        {citySearchData.data.wind.speed} kph
                                      </span>
                                    </dd>
                                  </div>
                                  <div className="mt-6 flex w-full flex-none gap-x-4  px-6 pt-6">
                                    <dt className="flex-none">
                                      <TbActivityHeartbeat
                                        aria-hidden="true"
                                        className="h-8 w-8 text-gray-400"
                                      />
                                    </dt>
                                    <dd className="text-sm font-medium leading-6 text-gray-900">
                                      <span className="mr-4">Pressure</span>
                                      <span className="text-blue-500 ml-6">
                                        {citySearchData.data.main.pressure} HPa
                                      </span>
                                    </dd>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="error-msg">No Data Found</div>
                    )}

                    {/* extended forecastData for 5 days */}

                    {filteredForecast.length > 0 ? (
                      <div className="pl-6  pr-6 pb-6 flex rounded-md shadow-sm ">
                        <div className=" flex-grow items-stretch focus-within:z-10 bg-gray-200 p-6 rounded-md shadow-sm">
                          <h2 className="text-gray-500 text-2xl">
                            Extended Forecast of 5 Days
                          </h2>
                          <div>
                            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                              {filteredForecast.map((data, id) => {
                                const date = new Date(data.dt_txt);
                                const day = date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                });
                                return (
                                  <div
                                    key={id}
                                    className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-9 hover:bg-gray-300 cursor-pointer scale-100 transition-transform duration-500 ease-in-out hover:scale-95"
                                  >
                                    <dt>
                                      <div className="absolute rounded-md bg-indigo-300 p-3">
                                        <img
                                          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                          alt="icon"
                                          className="w-8 h-8"
                                        />
                                      </div>
                                      <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                        {data.weather[0].description}
                                      </p>
                                    </dt>
                                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {data.main.temp_max}&deg; C{" "}
                                        {data.main.temp_min}&deg; C
                                      </p>
                                      <p className="text-sm font-semibold text-green-700">
                                        {"max"}&deg; C {"min"}&deg; C
                                      </p>
                                    </dd>

                                    <div className="text-2xl mt-4">
                                      <p className="font-semibold text-indigo-600 hover:text-indigo-500 text-center">
                                        {day}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </dl>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="error-msg">No Data Found</div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
