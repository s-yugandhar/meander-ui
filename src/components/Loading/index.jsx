import React, { useState } from "react";
import "./loading.scss";

const Loading = (props) => {
   return (
      <div className={props.show ? props.fullPage ? 'loadingBlock show full-page' : 'loadingBlock show' : 'loadingBlock'}>
         <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
      </div>
   );
};

export default Loading;
