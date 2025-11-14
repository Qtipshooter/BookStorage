import React from "react";
import Home from "../pages/Home";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), React.createElement(Home));