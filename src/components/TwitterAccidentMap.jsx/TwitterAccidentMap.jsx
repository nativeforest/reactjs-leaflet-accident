import React from "react";
import "./style.css";
import { LatLng, LatLngBounds } from "leaflet";
import {
  Map,
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Marker,
  Popup
} from "react-leaflet";
import * as data from "../../models/data.json";
import DraggableMarker from "../DraggableMarker/DraggableMarker";

export default class TwitterAccidentMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 4.595911000000002,
      lng: -74.12117349999999,
      zoom: 11,
      markers: [],
      accidentMarkers: [],
      accidentDateMin: "",
      accidentDateMax: "",
      draggable: true
    };
    this.mapRef = React.createRef();
  }
  displayMarkers = () => {
    if (this.state.accidentDateMin === "") {
      this.setState({
        markers: data.data,
        accidentMarkers: data.data
      });
    } else {
      this.onFilterAccident(null);
    }
  };

  onChangeEvent = event => {
    console.log("target value " + event.target.name, event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onFormatingDates = () => {
    const { accidentDateMin, accidentDateMax } = this.state;
    const dateMin = new Date(accidentDateMin + " 00:00:01");
    var dateMax = new Date(accidentDateMax + " 23:59:59");

    if (accidentDateMax === "") {
      dateMax = new Date("3050-12-31" + " 23:59:59");
    }

    return { dateMin, dateMax };
  };

  onFilterAccident = e => {
    const { markers, accidentDateMin } = this.state;

    if (accidentDateMin === "") {
      this.setState({
        markers: data.data,
        accidentMarkers: data.data
      });
      return "reeset and get out";
    }

    const { dateMin, dateMax } = this.onFormatingDates();

    const resultFilter = markers.filter(item => {
      const dateCreated = new Date(item.created_at);
      const filter1 = dateCreated.getTime() >= dateMin.getTime();
      const filter2 = dateCreated.getTime() <= dateMax.getTime();
      //triming string date
      // const dateArray = dateCreated.match(/.{1,10}/g);
      // const finalDate = dateArray[0];
      // console.log(filter1 && filter2)
      return filter1 && filter2;
    });

    this.setState({ accidentMarkers: resultFilter });
    console.log(resultFilter.length);
  };

  componentDidMount = () => {
    this.displayMarkers();
  };

  render() {
    const accidentMarkers = this.state.accidentMarkers.map((v, i) => {
      var obj = v.location;
      const r = obj.replace("'lat'", '"lat"');
      const r2 = r.replace("'lng'", '"lng"');
      const jsonPosition = JSON.parse(r2);
      return (
        <CircleMarker
          center={jsonPosition}
          key={i}
          radius={3}
          pathOptions={{ color: "red" }}
        >
          <Popup>{v.clean}</Popup>
        </CircleMarker>
      );
    });

    const position = [4.595911000000002, -74.12117349999999];
    const { accidentDateMin, accidentDateMax } = this.state;

    return (
      <div className="twitter-accident">
        <h1>Hello map!</h1>
        <MapContainer
          center={position}
          zoom={11}
          ref={this.mapRef}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[4.699996000000017, -74.12117349999999]}>
            <Popup>i dont give u a f shi#</Popup>
          </Marker>

          {accidentMarkers}
          <DraggableMarker />
        </MapContainer>
        <div>
          <label>
            From :
            <input
              type="date"
              value={accidentDateMin}
              name="accidentDateMin"
              onChange={e => this.onChangeEvent(e)}
            />
          </label>
          <label>
            To :
            <input
              type="date"
              value={accidentDateMax}
              name="accidentDateMax"
              onChange={e => this.onChangeEvent(e)}
            />
          </label>
          <button onClick={e => this.onFilterAccident(e)}>Filter</button>
        </div>
      </div>
    );
  }
}
