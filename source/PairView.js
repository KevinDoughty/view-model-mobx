import React, { Component } from "react";
import Divider from "./Divider.js";

const PairView = (class extends Component {
	resizeDivider(e) {
		const frame = this.props.frame;
		const node = this.props;//.node;
		const vertical = node.vertical;
		const dimension = vertical ? frame.size.height : frame.size.width;
		const loc = vertical ? frame.origin.y : frame.origin.x;
		const value = vertical ? e.clientY : e.clientX;
		const ratio = (value - loc) / dimension;
		const result = Math.max(0,Math.min(1,ratio));
		this.props.mutable.dividerRatio = result;
	}

	draggingDivider(draggingDivider) {
		console.log("pair drag props:", this.props );
	}

	render() {
		const frame = this.props.frame;
		var width = frame.size.width;
		var height = frame.size.height;
		var x = 0;//this.props.frame.origin.x;
		var y = 0;//this.props.frame.origin.y;
		
		const node = this.props;//.node;
		const vertical = node.vertical;
		
		let dividerRatio = node.dividerRatio;
		let dividerLoc = dividerRatio * (vertical ? height : width);
		if (typeof dividerRatio === "undefined" || dividerRatio === null) {
			const childNodes = node.childNodes;
			if (childNodes && childNodes.length) {
				const amount = (vertical) ? childNodes[0].height : childNodes[0].width;
				if (typeof amount !== "undefined") dividerLoc = amount;
				else dividerLoc = (vertical ? height : width) / 2;
			} else dividerLoc = (vertical ? height : width) / 2;
		}
		const dividerWidth = node.dividerWidth || 0;
		const halfDividerWidth = dividerWidth / 2;
		const leftWidth = dividerLoc - halfDividerWidth;
		const rightWidth = (vertical ? height:width) - dividerLoc - halfDividerWidth;
		//const leftLoc = (vertical ? y:x);
		const rightLoc = dividerLoc + halfDividerWidth;
		const middleLoc = dividerLoc - halfDividerWidth;

		const leftFrame = (vertical ? {
			//origin: {x:x, y:leftLoc},
			origin: {x:0, y:0},
			size: {width:width, height:leftWidth}
		} : {
			//origin: {x:leftLoc, y:y},
			origin: {x:0, y:0},
			size: {width:leftWidth, height:height}
		});
		const rightFrame = {
			origin: {x:(vertical ? x:rightLoc), y:(vertical ? rightLoc:y)},
			size: {width:(vertical ? width:rightWidth), height:(vertical ? rightWidth:height)}
		};
		const middleFrame = {
			origin: {x:(vertical ? x:middleLoc), y:(vertical ? middleLoc:y)},
			size: {width:(vertical ? width:dividerWidth), height:(vertical ? dividerWidth:height)}
		};

		var splitStyle = {
			left: frame.origin.x + "px",
			top: frame.origin.y + "px",
			width: frame.size.width + "px",
			height: frame.size.height + "px",
			position:"absolute"
		};

		const cursor = (vertical ? "row-resize" : "col-resize");
		const originalChildren = React.Children.toArray(this.props.children);
		var left = React.cloneElement(originalChildren[0], {
			frame: leftFrame,
			//style:leftStyle,
			key:"leftPane"
		});
		var right = React.cloneElement(originalChildren[1], {
			frame: rightFrame,
			//style:rightStyle,
			key:"rightPane"
		});
		
		const dividerProps = {
			resizeDivider:this.resizeDivider.bind(this),
			draggingDivider:this.draggingDivider.bind(this),
			dividerWidth:dividerWidth,
			frame: middleFrame,
			cursor: cursor,
			key:"divider",
			vertical:vertical,
			controlView:this
		};
		
		const divider = React.createElement(Divider, dividerProps);
		const children = (dividerWidth ? [left, divider, right] : [left, right]);

		var className = "split horizontal";
		if (vertical) className = "split vertical";

		var result = (
			React.DOM.div({
				key : "splitView",
				className : className,
				style : splitStyle
			}, children)
		);
		return result;
	}
});
export default PairView;