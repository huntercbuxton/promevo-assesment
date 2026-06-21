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
import LabelsList from './labelslist';
import UpdateLabel from './updatelabel.tsx'

// const ListLabels = function() {
//   return <h1>List Labels Page</h1>
// }
const ViewLabel = function() {
  return <h1>View Label Page</h1>
}
const LandingPage = () => <h1>Landing Page</h1>
// const UpdatePage = () => <h1>Update Page</h1>
const CreatePage = () => <h1>Create Page</h1>
const DeletePage = () => <h1>Delete Page</h1>

const router = createBrowserRouter([
  {
    path: "/", 
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      {
        path: "list",
        Component: LabelsList
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
    ]
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);