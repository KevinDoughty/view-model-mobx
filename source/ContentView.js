import React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";

const ContentView = observer(class extends Component {
	elementAttributesFromNode(node) {
		const result = Object.assign(toJS(node.mutable),{ key: node.key });
		const childrenKey = this.props.childrenKey;
		const relationship = this.props.store.relationships.oneToMany[childrenKey];
		delete result[childrenKey];
		delete result.kind;
		delete result.frame;
		Object.keys(relationship).forEach( key => delete result[key] );
		return result;
	}

	elementForNode(node, frame) {
		const childrenKey = this.props.childrenKey || "childIds";
		const relationship = this.props.store.relationships.oneToMany[childrenKey];
		const type = node.kind || node.type; // Use kind so you can create <input type="...">
		let children = [];
		const props = Object.assign({},node);
		props.actions = this.props.actions;
		props.store = this.props.store;
		if (typeof frame !== "undefined") props.frame = frame;
		const childNodes = node[relationship.toMany];
		if (childNodes) childNodes.forEach( (child) => {
			const element = this.elementForNode(child, frame);
			if (element) children.push(element);
		});

		if (typeof type === "string") { // "div", "span", etc
			const attributes = this.elementAttributesFromNode(node);
			return React.createElement(type, attributes, children);
		} else if (type) {
			return React.createElement(observer(type), props, children);
		} // else if React 16 return children
	}

	render() {
		const { node, frame } = this.props;
		//console.log("ContentView render node:",node);
		return this.elementForNode(node, frame);
	}
});
export default ContentView;