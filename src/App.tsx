import React, { Component, Suspense } from "react";
import Header from "./components/Header";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Redirect,
} from "react-router-dom";

//Pages
import MainPage from "./pages";
import ProductsPage from "./pages/products";

const Loader = () => (
  <div className="App">
    {/* <img src={logo} className="App-logo" alt="logo" /> */}
    <div>loading...</div>
  </div>
);

class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={<Loader />}>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/products" element={<ProductsPage />} />
            {/* <Route exact path="/404" component={NotFound} />
            <Redirect to="/404" /> */}
          </Routes>
        </Suspense>
      </Router>
    );
  }
}

export default App;
