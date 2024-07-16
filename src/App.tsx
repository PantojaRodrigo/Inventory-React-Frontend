import "./App.css";
import Inventory, { loader as itemsLoader } from "./routes/Inventory";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inventory />,
    loader: itemsLoader,
    /* children: [
      { path: "/create-post", element: <NewPost />, action: newPostAction },
      {
        path: "/:postId",
        element: <PostDetails />,
        loader: postDetailsLoader,
      },
    ], */
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
