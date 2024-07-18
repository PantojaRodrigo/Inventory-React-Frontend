import "./App.css";
import Inventory, { loader as itemsLoader } from "./routes/Inventory";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import NewItem, { action as itemAction } from "./routes/NewItem";
import RootLayout from "./routes/RootLayout";
import ItemDetail, { loader as itemLoader } from "./routes/ItemDetail";

const router = createBrowserRouter([
  {
    path: "/items",
    element: <Outlet />,
    /* errorElement: <ErrorPage />, */
    children: [
      {
        index: true,
        element: <Inventory />,
        loader: itemsLoader,
      },
      {
        path: "newItem",
        element: <NewItem />,
        action: itemAction,
      },
      {
        path: ":itemId",
        element: <ItemDetail />,
        loader: itemLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
