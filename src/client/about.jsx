import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Template from '../components/Template.jsx';
import About from '../components/About.jsx';

hydrateRoot(document.getElementById('root'), <Template><About /></Template>);
