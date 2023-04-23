import { BrowserRouter, Routes } from "react-router-dom";
import ScrollTop from "./component/ScrollTop";
import listRoute, { RenderRoutes } from "./routes";
require("dotenv").config();

function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>{RenderRoutes(listRoute)}</Routes>
    </BrowserRouter>
  );
}
export default App;
