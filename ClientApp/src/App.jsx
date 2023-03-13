import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./components/loading";
import Days from "./components/days";
import Details from "./components/details";
import clouds from "./assets/clouds.jpg";
import rain from "./assets/rain.jpg";
import snow from "./assets/snow.jpg";
import clear from "./assets/sunny.jpg";
import thunderstorm from "./assets/thunder.jpg";
import atmosphere from "./assets/mist.jpg";

// Global variables that are needed for other sections to work
export let lat, lon, loc, wea;
function App() {

  // State Decalrations and default values
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [dayShown, setDayShown] = useState(true);
  const [detailsShown, setDetailsShown] = useState(false);
  const [done, setDone] = useState(undefined);

  /* useEffect -> Runs everytime data is rendering/re-rendering
     * If the data exists, it makes a promise that changes the background first, then
     * if that resolves, it will render everything by setting done to true after a timeout
     * Rejects --> Will console a rejected message
     * Else statement only runs when the page is first loaded
     */

  useEffect(
    () => {
      if (data.name) {
        let myPromise = new Promise(function(resolve, reject) {
          resolve(changeBackground());
          reject(() => console.log("REJECTED"));
        });
        myPromise.then(
          setTimeout(() => {
            setDone(true);
          }, 2000)
        );
      } else {
        setDone(true);
      }
    },
    [data]
  );

  const key = process.env.REACT_APP_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`;
  const startUrl = ` https://api.openweathermap.org/data/2.5/weather?q=Texas&units=imperial&appid=${key}`;

  /* searchLocation -> Takes the location value in the input box, and fetches the openweathermap api appends the data
     * Makes sure enter is clicked for confirmation of input
     * Resets the apge state by setting done to false to re-render, and set other variable values
     */

  const searchLocation = event => {
    if (event.key === "Enter") {
      axios.get(url).then(response => {
        setDone(false);
        setData(response.data);
        console.log(response.data);
      });
      setLocation("");
    }
  };

  /* changeBackground -> Does the background changes depending on the weather
 */
  function changeBackground() {
    const app = document.querySelector(".app");

    wea = data.weather[0].main;

    if (wea == "Clouds") {
      app.style.setProperty(`--beforeBack`, `url(${clouds})`);
      return Promise.resolve;
    } else if (wea == "Clear") {
      app.style.setProperty(`--beforeBack`, `url(${clear})`);
      return Promise.resolve;
    } else if (wea == "Rain" || wea == "Drizzle") {
      app.style.setProperty(`--beforeBack`, `url(${rain})`);
      return Promise.resolve;
    } else if (wea == "Snow") {
      app.style.setProperty(`--beforeBack`, `url(${snow})`);
      return Promise.resolve;
    } else if (wea == "Thunderstorm") {
      app.style.setProperty(`--beforeBack`, `url(${thunderstorm})`);
      return Promise.resolve;
    } else if (wea == "Atmosphere") {
      app.style.setProperty(`--beforeBack`, `url(${atmosphere})`);
      return Promise.resolve;
    } else {
      console.log("error");
      return Promise.reject;
    }
  }

  /* getLocLat -> Gets the lon, lat, and loc values of the location that is typed into the input
     * In the case of defaultLocation, it sets the values as Texas values for the default
     */
  function getLonLat() {
    if (data.name) {
      lat = data.coord.lat;
      lon = data.coord.lon;
      loc = data.name;
    }
  }

  /* defaultLocation -> Fetches the openweathermap api data for the starting location
     * Texas is the starting location
     * Only renders and runs when page is first loaded
     */

  function defaultLocation() {
    axios.get(startUrl).then(response => {
      setData(response.data);
    });
  }

  /* dayClicked -> If the weather title is clicked in the navbar
     * ---> Sets state so next few days' weather tab is displayed and rendered while current day details is not
     */
  const dayClicked = () => {
    if (!dayShown) {
      setDayShown(true);
      setDetailsShown(false);
    }
  };

  /* detalisClicked -> If the details title is clicked in the navbar
     * ---> Sets state so details tab is displayed and rendered while days is not
     */
  const detailsClicked = () => {
    if (!detailsShown) {
      setDetailsShown(true);
      setDayShown(false);
    }
  };

  /* getTime -> Takes a time parameter that is in unix code, and converts it into GMT (PDT)
 * Returns that time with A.M. and P.M.
 */

  function getTime(time) {
    const dt = new Date(time * 1000);
    const hours = dt.getHours();
    const minutes = "" + dt.getMinutes();

    let realTime = hours + ":" + minutes.substr(-2);

    if (hours > 12) {
      realTime = hours - 12;
    } else {
      realTime = hours;
    }
    if (minutes < 10) {
      realTime += ":0" + minutes;
    } else {
      realTime += ":" + minutes;
    }
    if (hours >= 12) {
      realTime += " P.M. PST";
    } else {
      realTime += " A.M. PST";
    }

    return realTime;
  }

  /* todayDate -> Gets today's date --> mon/day/year --> Returns that string
 */
  function todayDate() {
    const dt = new Date();

    const mon = dt.getMonth() + 1;
    const day = dt.getDate();
    const year = dt.getFullYear();

    const date = mon + "/" + day + "/" + year;

    return date;
  }

  /* Return -> Renders the page
   * Loads while collecting data
   * Displays Data
   * Has a sub-section that default displays the next few days weather
   * --> If other tab is clicked, displays more details about the current day
   */
  return (
    <div className="app">
      {!done ? (
        <div className="loading">
          {" "}
          <Loading />{" "}
        </div>
      ) : (
        <>
          <div className="search">
            <input
              value={location}
              onChange={event => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="Enter Location"
              type="text"
            />
          </div>
          <div className="container">
            <div className="top">
              <div className="today">
                Today <p>{todayDate()}</p>
              </div>
              <div className="location">
                {data.name ? (
                  <p>
                    {" "}
                    {getLonLat()} {data.name}, {data.sys.country}{" "}
                  </p>
                ) : (
                  defaultLocation()
                )}
              </div>
              <div className="temp">
                {data.main ? (
                  <>
                    {data.main.temp}&#8457;
                    <div className="tempMinMax">
                      <p className="tempMin">Min {data.main.temp_min}&#8457;</p>
                      <p className="tempMax">
                        {" "}
                        Max {data.main.temp_max}&#8457;
                      </p>{" "}
                    </div>
                  </>
                ) : null}
              </div>
              <div className="feelsLike">
                {" "}
                {data.main ? (
                  <p>Feels: {data.main.feels_like}&#8457;</p>
                ) : null}{" "}
              </div>
              <div className="topdescription">
                {data.weather ? (
                  <p className="weatherType">{data.weather[0].main}</p>
                ) : null}
                {data.sys ? (
                  <div className="time">
                    {" "}
                    <p> Sunrise {getTime(data.sys.sunrise)} </p>
                    <p>Sunset {getTime(data.sys.sunset)}</p>{" "}
                  </div>
                ) : null}
              </div>
            </div>
            {data.name ? (
              <div className="bottom">
                <div className="nav">
                  <div className="weathernav" onClick={dayClicked}>
                    Weather
                  </div>
                  <div className="detailsnav" onClick={detailsClicked}>
                    Details
                  </div>
                </div>

                <div className="botdescription">
                  {dayShown && <Days />}
                  {detailsShown && <Details />}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
