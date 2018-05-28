import React from "react";

interface AppProps {}

interface AppState {}

class SideBar extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {
        return (
            <div className="side-bar">
                Side bar content
            </div>
        );
    }
}

export default SideBar;
