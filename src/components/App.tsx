import React from "react";
import { Map } from "./geo/Map";
import SideBar from "./SideBar";

interface AppProps {}
interface AppState {}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <SideBar />
        <Map />
      </div>
    );
  }
}

export default App;
