import React from "react";
import "./App.css";
import { Col, Row, CardHeader } from 'reactstrap';
import MapGoogle from './MapGoogle.js';

function App () {

  return (
    <div>
      <div className="App bg-white">
      <CardHeader className="cardheader-color"><h1 className="justtify-content-start text-white">Welcome to Google Map Autocomplete Search!</h1></CardHeader>
          <Row className="w-100">
              <MapGoogle />
          </Row>
      </div>
    </div>
  );
}

export default App;