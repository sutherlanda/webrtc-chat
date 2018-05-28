import mapboxgl from "mapbox-gl";
import React, { Component } from "react";

export interface MapProps {}

export interface MapState {
  lng: number;
  lat: number;
  zoom: number;
}

mapboxgl.accessToken = MAPBOX_TOKEN;

export class Map extends Component<MapProps, MapState> {
  mapContainer: HTMLDivElement;
  constructor(props: MapProps) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5,
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom,
    });
    map.on("move", () => {
      const center = map.getCenter();
      const latitude = center.lat;
      const longitude = center.lng;
      this.setState({
        lng: longitude,
        lat: latitude,
        zoom: map.getZoom(),
      });
    });
  }

  render() {
    return (
      <div>
        <div
          id="map"
          ref={el => (this.mapContainer = el)}
          className="map mapbox-gl map-component"
        />
      </div>
    );
  }
}
