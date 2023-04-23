import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VacancyList from "./pages/VacancyList";
import VacancyDetail from "./pages/VacancyDetail";
import VacancyCreate from "./pages/VacancyCreate";
import "./index.css";
import "./css/bootstrap/bootstrap.css";
import "./css/font_zen/style.css";
import "./css/font_awesome/css/all.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VacancyList />}></Route>
        <Route path="/:id" element={<VacancyDetail />}></Route>
        <Route path="/create" element={<VacancyCreate />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
