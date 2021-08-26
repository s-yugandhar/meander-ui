import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import {Context} from "../context";


const PageRouter = () => {

   const [logedIn, setLogedIn] = useState();
   const {state, dispatch} = useContext(Context);


   return (
     <Router>
       <Switch>

         <Route exact={true} path="/all-videos">

         </Route>

       </Switch>
     </Router>
   );
}


export default PageRouter;