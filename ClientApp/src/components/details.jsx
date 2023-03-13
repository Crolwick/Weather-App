import React, { useState, useEffect, useCallback } from "react";
import Loading from "./loading.jsx";
import axios from "axios";
import { loc } from "../App.jsx";
import WindDir from "./windDir.jsx";

let tempLoc = "Texas";

export let windDeg;

function displayDetails() {
  const [data, setData] = useState({});
  const [count, setCount] = useState(1);
  const [isDone, setIsDone] = useState(undefined);

  const key = process.env.REACT_APP_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=imperial&appid=${key}`;

  /* useEffect - Runs every time data re-renders / renders
     * Checks the count for whether its the first time page is laoded or not
     * Otherwise, waits a few seconds before checking the vaule of count to set the data of location typed
     * Returns default states for useStates created
     */
  useEffect(
    () => {
      checkCount();
      let myPromise = new Promise((resolve, reject) => {
        resolve(currentDetails());
        reject(() => console.log("REJECTED"));
      });
      myPromise.then(
        setTimeout(() => {
          setIsDone(true);
        }, 500)
      );
    },
    [data]
  );

  // CheckCount: Checks the state of count -> If it's not the first location
  function checkCount() {
    if (tempLoc != loc && loc != undefined) {
      tempLoc = loc;
      console.log(tempLoc);
    }
  }

  /* CurrentDetails: Checks conditions of the count state, then plays an api get function depending on state
       * Count = 1 -> Location is typed into the input box and enter is clicked
       */
  function currentDetails() {
    if (count == 1) {
      getLocation();
    }
  }

  /* GetLocation: Fetches the api for the location typed, and sets the data
       * Sets Count = 2 -> A Dead state for count, so it doesn't infinitly run
       */
  function getLocation() {
    axios.get(url).then(response => {
      setData(response.data);
      console.log(response.data);
    });
    setCount(2);
  }

  function getWindDir(deg) {
    windDeg = deg;
    let str = <WindDir />;
    return str;
  }

  return (
    <>
      {!isDone ? (
        <Loading />
      ) : (
        <>
          {data.clouds ? (
            <div className="details">
              {" "}
              <img className="cloudiness" /> &#160; Clouds &#160;&#160; &#160;
              &#160; &#160; &#160; {data.clouds.all}%
            </div>
          ) : null}
          {data.main ? (
            <div className="details">
              {" "}
              <img className="humidity" /> &#160; Humidity &#160; &#160; &#160;
              &#160; &#160; {data.main.humidity} %
            </div>
          ) : null}
          {data.main ? (
            <div className="details">
              <img className="pressure" />&#160; Pressure &#160; &#160; &#160;
              &#160; &#160; {data.main.pressure} hPa{" "}
            </div>
          ) : null}
          {data.wind ? (
            <div className="details">
              <img className="direction" />&#160; Wind Direction&#160;&#160;
              &#160; {data.wind.deg}&#xb0; {getWindDir(data.wind.deg)}
            </div>
          ) : null}
          {data.wind ? (
            <div className="details">
              {" "}
              <img className="gust" />&#160; Wind Gust &#160;&#160; &#160;
              &#160; &#160; {data.wind.gust} mi/hr{" "}
            </div>
          ) : null}
          {data.wind ? (
            <div className="details">
              <img className="speed" />&#160; Wind Speed &#160; &#160; &#160;
              &#160; {data.wind.speed} mi/hr
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default displayDetails;
