import "./App.css";
import Inventory, {
  loader as itemsLoader,
  action as itemDeleteAction,
} from "./routes/Inventory";

import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import NewItem, { action as itemAction } from "./routes/NewItem";
import ItemDetail, { loader as itemLoader } from "./routes/ItemDetail";
import ErrorPage from "./routes/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    loader: ({ request }) => {
      const url = new URL(request.url).pathname;
      if (url === "/") return redirect("/items");
      return null;
    },
    children: [
      {
        path: "items",
        element: <Outlet />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Inventory />,
            loader: itemsLoader,
            action: itemDeleteAction,
            errorElement: <ErrorPage />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
