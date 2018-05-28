import React from "react";
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
                <SideBar/>
            </div>
        );
    }
}

export default App;
