
    window.reactComponents = {};

    window.vueComponents = {};

  
      import React from "react";

      import ReactDOM from "react-dom";


      import ReactWrapper from '../../node_modules/better-docs/lib/react-wrapper.js';

      window.React = React;

      window.ReactDOM = ReactDOM;

      window.ReactWrapper = ReactWrapper;

    
    import './styles/reset.css';

    import './styles/iframe.css';

  import Component0 from '../../src/App/App.js';
reactComponents['App'] = Component0;

import Component1 from '../../src/pages/Auth/Auth.js';
reactComponents['Auth'] = Component1;

import Component2 from '../../src/pages/Primary/Primary.js';
reactComponents['Primary'] = Component2;