import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "/signin",
    element: <SigninForm />,
  },
]);
