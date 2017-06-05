import React from "react";
import { Component } from "react";

const BasicView = (class extends Component {
	render() {
		const node = this.props;
		//console.log("COLOR VIEW:%s; frame:%s; children:%s;",node.color,JSON.stringify(node.frame),React.Children.toArray(this.props.children));
		//console.log("COLOR VIEW:",this.props.mutable);
		let style = {
			width:"100%",
			height:"100%",
			backgroundColor: node.color
		};
		if (node.style) style = Object.assign({},node.style);
		if (node.width) style.width = node.width + "px";
		if (node.height) style.height = node.height + "px";
		if (node.frame) {
			style.left = node.frame.origin.x + "px";
			style.top = node.frame.origin.y + "px";
			style.width = node.frame.size.width + "px";
			style.height = node.frame.size.height + "px";
			style.position = "absolute";
		}
		const props = {
			style
		};
		if (node.className) props.className = node.className;
		//console.log("BasicView render props:",props,this.props);
		return React.DOM.div(props, this.props.children);
	}
});
export default BasicView;