import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Template from '../components/Template.jsx';
import Home from '../components/Home.jsx';

hydrateRoot(document.getElementById('root'), <Template><Home /></Template>);
