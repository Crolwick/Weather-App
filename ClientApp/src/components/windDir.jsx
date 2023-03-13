import { windDeg } from "./details.jsx";

/* findWindDirection -> Takes the angle direction of the wind in degrees
 * Calculates using given logic, and returns a cardinal direction
 */
function findWindDirection() {
  function logic(dir) {
    if ((dir >= 350 && dir <= 360) || (dir >= 0 && dir <= 10)) {
      return "N";
    }
    if (dir >= 11 && dir <= 34) {
      return "N / NE";
    }
    if (dir >= 35 && dir <= 55) {
      return "NE";
    }
    if (dir >= 56 && dir <= 79) {
      return "E / NE";
    }
    if (dir >= 80 && dir <= 100) {
      return "E";
    }
    if (dir >= 101 && dir <= 124) {
      return "E / SE";
    }
    if (dir >= 125 && dir <= 145) {
      return "SE";
    }
    if (dir >= 146 && dir <= 169) {
      return "S / SE";
    }
    if (dir >= 170 && dir <= 190) {
      return "S";
    }
    if (dir >= 191 && dir <= 214) {
      return "S / SW";
    }
    if (dir >= 215 && dir <= 235) {
      return "SW";
    }
    if (dir >= 236 && dir <= 259) {
      return "W / SW";
    }
    if (dir >= 260 && dir <= 280) {
      return "W";
    }
    if (dir >= 281 && dir <= 304) {
      return "W / NW";
    }
    if (dir >= 305 && dir <= 325) {
      return "NW";
    }
    if (dir >= 326 && dir <= 349) {
      return "N / NW";
    }
  }

  return logic(windDeg);
}

export default findWindDirection;
