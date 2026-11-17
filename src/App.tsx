import "./App.css";
import Routing from "./routing/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import userStore from "./store/userStore";
import GlobalLoader from "./components/ui/GlobalLoader";

function App() {
  const { fetchCurrentUser } = userStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Routing />
      <GlobalLoader />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
