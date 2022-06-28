import React, { Component } from "react";
import "./App.css";
import { Col, Row, CardHeader, FormGroup } from 'reactstrap';
import { withStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA16d9FJFh__vK04jU1P64vnEpPc3jenec");
Geocode.enableDebug();

const styles = {
  input: {
      color: "#fff",
      opacity: 0.8
  }
};


class MapGoogle extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      area: "",
      state: "",
      mapPosition: {
        lat: 3.1390,
        lng: 101.6869
      },
      markerPosition: {
        lat: 3.1390,
        lng: 101.6869
      }
    };
  console.log(this.state.mapPosition.lat, 'mapPosition');

  }
 
  
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log("city", city, area, state);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = event => {};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      }
    });
  };
  
  onMarkerDragEnd = event => {
    console.log("event", event);
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];
    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  };

  render() {

    const AsyncMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng
          }}
        >
          {/* For Auto complete Search Box */}
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "100px"
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          />
          {/*Marker*/}
          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng
            }}
          />
          <Marker />
          {/* InfoWindow on top of marker */}
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow>
        </GoogleMap>
      ))
    );
    let map;
    if (this.state.mapPosition.lat !== undefined) {
      map = (
        <div>
          <div classname="col">
            <div className="">
                <Row form className="justify-content-start m-2">
                  <Col className="col-lg-4 col-sm-4 col-xs-4 col-md-4 w-75">
                    <FormGroup>
                      <TextField 
                        variant="outlined" 
                        size="small" 
                        label="City" 
                        name="query" 
                        placeholder="Enter a City"
                        InputLabelProps={{ shrink: true }}
                        className="input-form-textfield" 
                        onChange={this.onChange}
                        readOnly="readOnly"
                        value={this.state.city}
                        />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form className="justify-content-start m-2">
                  <Col className="col-lg-4 col-sm-4 col-xs-4 col-md-4 w-75">
                    <FormGroup>
                      <TextField 
                        variant="outlined" 
                        size="small" 
                        label="Area" 
                        name="query" 
                        placeholder="Enter an Area"
                        InputLabelProps={{ shrink: true }}
                        className="input-form-textfield" 
                        onChange={this.onChange}
                        readOnly="readOnly"
                        value={this.state.area}
                        />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form className="justify-content-start m-2">
                  <Col className="col-lg-4 col-sm-4 col-xs-4 col-md-4 w-75">
                    <FormGroup>
                      <TextField 
                        variant="outlined" 
                        size="small" 
                        label="Address" 
                        name="query" 
                        placeholder="Enter an Address"
                        InputLabelProps={{ shrink: true }}
                        className="input-form-textfield" 
                        onChange={this.onChange}
                        readOnly="readOnly"
                        value={this.state.address}
                        />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
          </div>
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA16d9FJFh__vK04jU1P64vnEpPc3jenec&libraries=places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default withStyles(styles)(MapGoogle);
