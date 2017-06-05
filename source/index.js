import React from "react";
import { render } from "react-dom";
import { extendObservable, observable, computed, autorun } from "mobx";

import { transformer  } from "./transformer";
import hierarchy from "./hierarchy";
import relationships from "./relationships";

import App from "./App";


class ViewModel {
	constructor(nodes,relationships) {
		this.relationships = relationships;
		//this.nodes = observable(nodes);
		extendObservable(this, {
			nodes: observable.map(nodes),
			graph: computed(function() {
				return transformer(relationships)(this.nodes);
			})
		});
	}
}

const store = new ViewModel(hierarchy,relationships);

// autorun(() => {
// 	if (store.graph.get("InnerSplit").dividerRatio === 0) console.log("zero");
// 	//console.log("store.graph:",store.graph);
// });
// 
// console.log("store:",store);
// const graph = store.graph;
// console.log("graph:",graph);
// const node = graph["ContentView"];
// console.log("contentView:",node);
// 
// store.nodes.set("Another",{
// 	kind:"div",
// 	style: {
// 		backgroundColor:"green"
// 	}
// });

render(<App store={store} />, document.getElementById("root"));

// let i = 10000;
// while (i--) {
// 	store.graph.get("InnerSplit").mutable.dividerRatio = i / 10000;
// }
// console.log("done");