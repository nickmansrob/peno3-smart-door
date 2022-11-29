import Home from "./pages/home/Home";
import List from "./pages/list/List";
import New from "./pages/new/New";
import Single from "./pages/single/Single"
import Weekly from "./pages/weekly/Weekly";
import Edit from "./pages/edit/Edit";
import Login from "./pages/login/Login"

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

//import { Schema } from "@mui/icons-material";


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
            <Route path = 'weekly' element= {<Weekly/>}>
            <Route path = ':userId' element = {<Weekly/>}>
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
