import React from "react";

interface AppProps {}
interface AppState {}

class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                Content goes here
            </div>
        );
    }
}

export default App;
