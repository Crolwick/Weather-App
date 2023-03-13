import React from "react";
import ReactLoading from "react-loading";

/* Loading -> Simple loading functional component
 * Used to show a loading screen when needed
 */
function Loading() {
  return (
    <>
      <p className="loadingText"> Loading </p>
      <ReactLoading type={"bars"} color={"#fff"} height={150} width={150} />
    </>
  );
}

export default Loading;
