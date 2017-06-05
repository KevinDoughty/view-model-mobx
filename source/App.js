import React, { Component } from "react";
import ContentView from "./ContentView.js";

import {observer} from "mobx-react";

var App = observer(class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keydown: this.keydown.bind(this),
			keyup: this.keyup.bind(this),
			resize: this.resize.bind(this)
		};
		//this.props.demoPopulate(1);
	}
	keydown(e) {
		this.toggleKeys(e);
	}
	keyup(e) {
		this.toggleKeys(e);
	}
	toggleKeys(e) {
// 		var editingId = this.props.editingId;
// 		if ((editingId === null || typeof editingId === "undefined" || editingId === -1) && this.props.shiftKeyPressed !== e.shiftKey) {
// 			var shiftKeyPress = this.props.shiftKeyPress.bind(this);
// 			shiftKeyPress(!this.props.shiftKeyPressed);
// 		}
	}
	resize(e) {
		this.forceUpdate();
	}
	componentDidMount() {
		document.addEventListener("keydown",this.state.keydown);
		document.addEventListener("keyup",this.state.keyup);
		window.addEventListener("resize",this.state.resize);
	}
	componentWillUnmount() {
		window.removeEventListener("resize",this.state.resize);
		document.removeEventListener("keyup",this.state.keyup);
		document.removeEventListener("keydown",this.state.keydown);
	}
	render() {
		const width = document.body.offsetWidth;
		const height = document.body.offsetHeight;
		const frame = {origin:{x:0,y:0},size:{width,height}};

		var nodeDict = this.props.store.graph;
		
		//console.log("App nodeDict:",nodeDict);
		//var node = nodeDict.get("ContentView");
		let node;
		if (nodeDict.get && nodeDict.set) node = nodeDict.get("ContentView");
		else node = nodeDict["ContentView"];
		
		//console.log("App render");
		
		return React.createElement(ContentView, {
			key: "ContentView",
			//id:"ContentView", // default
			//relationship:"childIds", // default
			childrenKey:"childIds",
			node: node,
			store:this.props.store,
			frame:frame
		});
	}
});
export default App;