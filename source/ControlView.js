import React, { Component } from "react";
import SegmentedControl from "./SegmentedControl.js";

const ControlView = (class extends Component{
	render() {
		const controlStyle = {
			width:"100%"
		};
		return (
			React.DOM.div({
				style:controlStyle
			},
				React.createElement(SegmentedControl, {
					representedObject: this.props.representedObject
				})
			)
		);
	}
});
export default ControlView;