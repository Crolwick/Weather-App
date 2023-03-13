import React, { useEffect, useState } from "react";
import axios from "axios";
import { lat, lon } from "../App.jsx";
import Loading from "./loading.jsx";

/* tempLat -> Used as a global variable to save value even when the component is off render
 * Used for comparisons that helps logic dictate which state to be in
 * tempLon is not needed as they will change together, so only one comparison is needed
 */
let tempLat;

/* days -> The functional component that will be returned, and used in other files
 * Returns divs that display the next five days with temperature, type of weather, and icons
 */

function days() {
  // Default Variables
  const dt = new Date();

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  let nextDays = day + 1;
  let dayCount = 0;
  const maxValue = day + 7;

  // State Declarations and Default Values
  const [data, setData] = useState([]);
  const [done, setDone] = useState(undefined);
  const [count, setCount] = useState(1);

  const key = process.env.REACT_APP_API_KEY;

  const nextUrl = ` https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&cnt=40&appid=${key}`;

  /* useEffect -> Runs code when component renders / re-renders
   * First checks the current state of page
   * Then gets a promise to resolve retreving the weather api data
   * Finally sets a timeout that sets done to true
   * ---> Indicates that the page is ready to render
   */
  useEffect(() => {
    check();
    let myPromise = new Promise((resolve, reject) => {
      resolve(getWeather());
      reject(() => console.log("REJECTED"));
    });
    /* Check data values -> */ console.log(data);
    myPromise.then(
      setTimeout(() => {
        setDone(true);
      }, 300)
    );
  }),
    [data];

  /* check -> Checks the lat and lon values to make change state
   * Only runs if the page is not rendered for the first time
   * ---> This is because lon will have a value when a location is typed in the input
   *      Also, lat's value would change to be different from tempLat's as well
   * Copies over the inputted lat and lon values over to the temp versions to continue
   */
  function check() {
    if (tempLat != lat && lon != undefined) {
      tempLat = lat;
    }
  }

  /* nextDay -> Gets the current date, and uses it to get the string values of the day
   * Grabs the next couple of days string values, and returns them
   * Maximum of 5 days grabbed, and when reached, returns a blank str to indicate its done
   */
  function nextday() {
    let nextdt = new Date(year, month, nextDays);

    const dayWeek = nextdt.toLocaleString("default", { weekday: "long" }); // Creating the weekday name
    const curMon = nextdt.getMonth() + 1; // Getting the current month date
    const curDate = nextdt.getDate(); // Getting the current day in month
    const weekDay = dayWeek.slice(0, 3); // First three letters of the weekday

    const fullStr = weekDay + " " + curMon + "/" + curDate; // Combining the whole string

    if (dayCount < 7) {
      nextDays++;
      dayCount++;
    }

    if (nextDays == maxValue) {
      return "";
    } else if (nextDays < maxValue) {
      return fullStr;
    }
  }

  /* getWeather -> Fetches the openweathermap api from the variable above of inputted location, and sets the data
   * Count = 2 -> Dead State for Count to make sure function doesn't infinitely run
   */
  function getWeather() {
    if (count == 1) {
      axios.get(nextUrl).then(response => {
        setData([
          { dayId: 0, value: response.data.list[8] }, // list[8] -> Tomorrow
          { dayId: 1, value: response.data.list[16] }, // list[16] Two Days Ahead
          { dayId: 2, value: response.data.list[24] }, // list[24] Three Days Ahead
          { dayId: 3, value: response.data.list[32] }, // list[32] Four Days Ahead
          { dayId: 4, value: response.data.list[39] } // list[39] Five Days Ahead
        ]);
      });
      setCount(2);
    }
  }

  /* getDayDescription -> Takes a str argument, and splices the first letter from the rest of the charcters
   * Changes the first letter to a capitol, and reappends it to the other charcters
   * Returns the combined string
   */
  function getDayDescription(str) {
    const dayString = str;
    const actualString = dayString.charAt(0).toUpperCase() + str.slice(1);

    return actualString;
  }

  /* Return -> Returns react elements that renders the weather for the next few days of selected location
   * Information includes temperature, the type of weather, and an icon idication
   * Uses map to allocate five days worth of information divs
   */
  return (
    <>
      {!done ? (
        <Loading />
      ) : (
        data.map(data => (
          <div key={data.dayId} className="days">
            {nextday()}&#160; &#160; {data.value.main.temp}&#8457; &#160;&#160;
            {getDayDescription(data.value.weather[0].description)}
            &#160;&#160;
            <img
              src={`https://openweathermap.org/img/wn/${
                data.value.weather[0].icon
              }.png`}
            />
          </div>
        ))
      )}
    </>
  );
}

export default days;
