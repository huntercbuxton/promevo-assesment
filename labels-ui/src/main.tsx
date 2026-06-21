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
import UpdateLabel from './updatelabel'

// temp
import { MockLabelsDataGrid } from './labelsgrid.tsx' 
// const ListLabels = () => <h1>List Labels Page Placeholder</h1>
const ViewLabel = () => <h1>View Label Page Placeholder</h1>
const LandingPage = () => <h1>Landing Page Placeholder</h1>
// const UpdatePage = () => <h1>Update Page Placeholder</h1>
const CreatePage = () => <h1>Create Page Placeholder</h1>
const DeletePage = () => <h1>Delete Page Placeholder</h1>

const router = createBrowserRouter([
  {
    path: "/", 
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      {
        path: "list",
        // Component: LabelsList
        Component: LabelsListPage
      },
      //https://reactrouter.com/start/data/routing#dynamic-segments
      {
        path: "labels/:id",
        Component: ViewLabel
      },
      {
        path: "create",
        Component: CreatePage
      },
      {
        path: "update",
        Component: UpdateLabel
      },
      {
        path: "delete",
        Component: DeletePage
      }
      ,
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