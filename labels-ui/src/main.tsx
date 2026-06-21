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
import UpdatePage from './label';
import LabelDetailPage from './labeldetail.tsx';
import CreatePage from './create'
import DeletePage from './delete'

// temp
import { MockLabelsDataGrid } from './labelsgrid.tsx'
const LandingPage = () => <h1>Landing Page Placeholder</h1>

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { 
        index: true, 
        Component: LandingPage 
      },
      {
        path: "list", 
        Component: LabelsListPage
      },
      {
        path: "labels/:id",
        Component: LabelDetailPage
      },
      {
        path: "update/:id",
        Component: UpdatePage
      },
      {
        path: "create",
        Component: CreatePage
      },
      {
        path: "delete",
        Component: DeletePage
      },
      // TODO: remove this route before merging to main
      {
        path: "datagrid",
        Component: MockLabelsDataGrid
      }
    ]
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);