import Banner from "./components/Banner/Banner";
import Home from "./components/Home/Home";
import s from "./App.module.css";
import Account from "./Account";
import { Route, Routes } from "react-router-dom";
/*
 * Need:
 * Landing page
 * - tagline
 * - nav
 *   - connect to metamask tr
 *   - title tl
 * - display current yield
 *   - want some copy in middle with what the project is about
 * - probably want some reusable btn components
  a

  w.r.t. calling smart contracts
  on deploy we should get the deployed contract address and
  the functions as const

 * */

function App() {
  //  const location = useLocation();
  return (
    <div className={s.main}>
      <Banner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      {/* location.pathname === "/" ? (
        <footer className={s.footer}>
          <p>footer content here</p>
        </footer>
      ) : (
        <></>
      ) */}
    </div>
  );
}

export default App;