import Home from "./pages/home/Home";
import List from "./pages/list/List";
import New from "./pages/new/New";
import Single from "./pages/single/Single"
import Addweekly from "./pages/weekly/Addweekly";
import Edit from "./pages/edit/Edit";
import Login from "./pages/login/Login"
import Weeklytable from "./pages/weekly/Weeklytable"
import Editweekly from "./pages/weekly/Editweekly";
import * as jsrsasign from "jsrsasign"

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

//import { Schema } from "@mui/icons-material";

export function createJWT() {
  return jsrsasign.KJUR.jws.JWS.sign(null, {alg: 'HS256'}, {data: 'frontend', exp: Date.now() + 5 }, process.env.REACT_APP_JWT_SECRET ?? 'fakeSecret')
}


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = '/'>
            <Route index element = {<Home/>}/>
            <Route path = 'users'>
              <Route index element = {<List/>}></Route>
              <Route path = ':userId' element = {<Single/>}>
              </Route>
              <Route path = 'new' element = {<New/>}>
              </Route>
            
            </Route>
            <Route path = 'login' element = {<Login/>}
            ></Route>
            <Route path = 'weeklytable' element= {<Weeklytable/>} >
            <Route path = ':userId' element = {<Weeklytable/>}>
            </Route>
            </Route>
            <Route path = 'editweekly' element= {<Editweekly/>} >
            <Route path = ':userId' element = {<Editweekly/>}>
            </Route>
            </Route>

            <Route path = 'addweekly' element= {<Addweekly/>} >
            <Route path = ':userId' element = {<Addweekly/>}>
            </Route>
            </Route>
           
           
            <Route path = 'edit' element= {<Edit/>}>
            <Route path = ':userId' element = {<Edit/>}>
            </Route>
              </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
