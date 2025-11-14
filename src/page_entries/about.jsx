import React from "react";
import About from "../pages/About";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), React.createElement(About));