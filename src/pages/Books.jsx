import React from "react";
import Books from "../components/Books";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), React.createElement(Books));