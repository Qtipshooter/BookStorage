import React from "react";
import Books from "../pages/Books";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), React.createElement(Books));