import React from "react";
import ConnectionManager from "../net/ConnectionManager";
import ConnectControls from "./ConnectControls";

interface AppProps {}

interface AppState {
  connected: boolean;
  connectionManager: ConnectionManager;
}

class SideBar extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      connected: false,
      connectionManager: new ConnectionManager(),
    };
  }

  render() {
    return (
      <div className="side-bar">
        <ConnectControls
          connected={this.state.connected}
          onHost={this.state.connectionManager.host}
          onJoin={this.state.connectionManager.join}
        />
      </div>
    );
  }
}

export default SideBar;
