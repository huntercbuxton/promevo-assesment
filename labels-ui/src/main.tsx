import './index.css'
import App from './App.tsx'
// mui dependencies
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";

import LabelsListPage from './labelslist'; 
import LabelDetailPage from './labeldetail.tsx';
import CreatePage from './create'
import DeletePage from './delete'
  
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { 
        index: true, 
        Component: LabelsListPage 
      },
      {
        path: "list", 
        Component: LabelsListPage
      },
      {
        path: "labels/:id",
        Component: LabelDetailPage
        // TODO: add 404 page for invalid label id's
      },
      // {
      //   path: "update/:id",
      //   Component: UpdatePage
      //   // TODO: add 404 page for invalid label id's
      // },
      {
        path: "create",
        Component: CreatePage
      },
      {
        path: "delete",
        Component: DeletePage
      } 
    ]
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);