import React from "react";
import Home from "../components/Home";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), React.createElement(Home));