import React from "react";

interface AppProps {
  connected: boolean;
  onHost: () => void;
  onJoin: () => void;
}
interface AppState {}

class ConnectControls extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.connected ? "Connected" : "Not connected"}
        <button onClick={this.props.onHost}>Host</button>
        <button onClick={this.props.onJoin}>Join</button>
      </div>
    );
  }
}

export default ConnectControls;
