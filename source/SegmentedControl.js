import React, { Component } from "react";
//import DevTool, { configureDevtool } from "mobx-react-devtools";

// Any configurations are optional
// configureDevtool({
// 	// Turn on logging changes button programmatically:
// 	logEnabled: true,
// 	// Turn off displaying conponents" updates button programmatically:
// 	updatesEnabled: false,
// 	// Log only changes of type `reaction`
// 	// (only affects top-level messages in console, not inside groups)
// 	logFilter: change => change.type === "reaction",
// });


const SegmentedControl = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handleChoice:this.handleChoice.bind(this)
		};
	}
	handleChoice(choice) {
		const node = this.props.representedObject;
		const childIds = node.childIds;
		const visibleIndexes = node.mutable.visible;
		const indexOf = visibleIndexes.indexOf(choice);
		if (indexOf > -1) visibleIndexes.splice(indexOf,1);
		else for (let index = 0; index < childIds.length; index++) {
			if (index >= visibleIndexes.length || choice < visibleIndexes[index]) {
				visibleIndexes.splice(index, 0, choice);
				break;
			}
		}
	}
	render() {
		const node = this.props.representedObject;
		const childIds = node.childIds;
		const visibleIndexes = node.visible;
		const array = [];
		const handleChoice = this.state.handleChoice;
		childIds.forEach( (childId, index) => {
			if (index) array.push(" ");
			const active = (visibleIndexes.indexOf(index) > -1);
			const style = {
				textDecoration: active ? "none" : "line-through"
			};
			array.push( React.DOM.a({
				href:"#",
				key:"segmentedControlItem"+childId,
				style:style,
				onClick: function(e) {
					e.preventDefault();
					handleChoice(index);
				}
			}, childId));
		});
		const style = { display: "inline", marginLeft:"20px" };
		return (
			<div style={style}>
				{array}
			</div>
		);
	}
});
export default SegmentedControl;