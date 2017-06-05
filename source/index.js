import React from "react";
import { render } from "react-dom";
import { extendObservable, observable, computed, autorun } from "mobx";
//import { extendObservable, observable, computed } from "mobx";

//import { transformer, hierarchyTransformer, graphTransformer } from "./transformer";
import { transformer  } from "./transformer";

import App from "./App";
import BasicView from "./BasicView";
import PairView from "./PairView";
import ControlView from "./ControlView";
import ListHeader from "./ListHeader";
import ListView from "./ListView";
import GridHeader from "./GridHeader";
//import GridView from "./GridView";
import SegmentedControl from "./SegmentedControl";
import SelectControl from "./SelectControl";



// class ViewNode {
// 	constructor(node,relationships) {
// 	}
// }

class ViewModel {
	constructor(nodes,relationships) {
		this.relationships = relationships;
		//this.nodes = observable(nodes);
		//this.objects = observable.shallow(objectTransformer(relationships)(this.nodes));
// 		this.objects = transformer(relationships)(this.nodes);
// 		this.graph = computed(() => {
// 			return transformer(relationships)(this.nodes);
// 		});
		extendObservable(this, {
			nodes: observable(nodes),
			graph: computed(function() {
				return transformer(relationships)(this.nodes);
			})
// 			hierarchy: computed(function() {
// 				return hierarchyTransformer(relationships)(this.nodes);
// 			}),
// 			graph: computed(function() {
// 				return graphTransformer(relationships,this.nodes)(this.hierarchy);
// 			})
		});
// 		const graph = computed(() => {
// 		});
	}
}


const views = {
	ContentView: {
		kind: PairView,
		vertical:true,
		childIds:["ControlView","InnerSplit"]
	},
// 	ControlView: {
// 		kind: ControlView,
// 		height : 60,
// 		representedId:"GridView"
// 	},
	ControlView: {
		kind: BasicView,
		height:30,
// 		style: {
// 			width:"100%",
// 			height:"50px"
// 		},
		childIds:["SegmentedControl","SelectControl"]
	},
	SegmentedControl: {
		kind:SegmentedControl,
		representedId:"GridView"
	},
	SelectControl: {
		kind:SelectControl,
		representedId:"GridView",
		choiceIds:["Purple","Pink"]
	},

	InnerSplit: {
		kind: PairView,
		dividerWidth: 9,
		dividerRatio: 0.25,
		visible:[0,1],
		childIds:["ListPane", "GridPane"]
	},

	ListPane: {
		kind: PairView,
		vertical: true,
		childIds:["ListHeader", "ListView"]
	},


	ListHeader: {
		kind: ListHeader,
		height: 55 // pairViewHeight
	},
	ListView: {
		kind: ListView,
		margin: 9,
		dimension: 20,
		inset: 7
	},



	GridPane: {
		kind: PairView,
		vertical: true,
		childIds:["GridHeader", "GridView"]
	},


	GridHeader: {
		kind: GridHeader,
		height: 55 // pairViewHeight
	},


	GridView: {
		kind: "div",
		style: {
			backgroundColor:"darkgrey",
			//padding:"15px"
		},
		className:"container",
		childIds: ["One","Two","Three","Four"],

		visible:[],

// before & after won't work as children of PairView. Consider making above also wrap before & after

// 		before:"Before", // self
// 		after:"After", // self
		above:"Above", // self
		below:"Purple", // self

		header:"Header", // children
		footer:"Footer", // children
		between:"Between", // children
		wrappers:"Wrappers" // children

	},



	One: {
		kind: "div",
		style: {
			backgroundColor: "red",
			width:"100%",
			height:37
		}
	},
	Two: {
		kind: "div",
		style: {
			backgroundColor: "green",
			width:"100%",
			height:37
		}
	},
	Three: {
		kind: "div",
		style: {
			backgroundColor: "blue",
			width:"100%",
			height:37
		}
	},
	Four: {
		kind: "div",
		style: {
			backgroundColor: "orange",
			width:"100%",
			height:37
		}
	},

	Purple: {
		kind: "div",
		style: {
			backgroundColor:"purple",
			paddingTop:"15px",
			paddingBottom:"15px",
			width:"100%",
			position:"relative"
		},
		className: "purple"
	},
	Pink: {
		kind: "div",
		style: {
			backgroundColor:"pink",
			paddingTop:"15px",
			paddingBottom:"15px",
			width:"100%",
			position:"relative"
		},
		className: "pink"
	},

	Above: {
		kind: BasicView, // can't be a plain div because PairView passes frame
		style: {
			backgroundColor:"cyan"
		},
		className:"above"
	},
	Below: {
		kind: "div",
		style: {
			backgroundColor:"tan",
			padding:"5px"
		},
		className: "below"
	},
	Wrappers: {
		kind: "div",
		style: {
			backgroundColor:"brown",
			outline:"1px solid yellow",
			paddingLeft:"25px"
		},
		className:"wrappers"
	},
	Before: {
		kind: "div",
		style: {
			backgroundColor:"lightblue",
			width:"100%",
			height:"57px"
		},
		className:"before"
	},
	After: {
		kind: "div",
		style: {
			backgroundColor:"lightgreen",
			width:"100%",
			height:"57px"
		},
		className: "after"
	},
	Between: {
		kind: "div",
		style: {
			backgroundColor:"lightgray",
			width:"100%",
			height:"7px"
		},
		className:"between"
	},
	Header: {
		kind: "div",
		style: {
			backgroundColor:"black",
			width:"100%",
			height:"7px"
		},
		className:"header"
	},
	Footer: {
		kind: "div",
		style: {
			backgroundColor:"white",
			width:"100%",
			height:"7px"
		},
		className:"footer"
	}

};

/*
const views = {
	ContentView : {
		kind: "div",
		style: {
			width:"100%",
			height:"100%"
		},
		childIds:["SegmentedControl","Container"]
	},
	SegmentedControl: {
		kind: SegmentedControl,
		height : 60,
		pointerId:"Container"
	},
	Container : {
		kind: "div",
		style: {
			backgroundColor:"purple",
			padding:"15px"
		},
		className:"container",
		childIds: ["One","Two","Three","Four"],
		visible:[],

		before:"Before", // self
		after:"After", // self
		above:"Above", // self
		below:"Below", // self

		header:"Header", // children
		footer:"Footer", // children
		between:"Between", // children
		wrappers:"Wrappers" // children

	},



	One: {
		kind: "div",
		style: {
			backgroundColor: "red",
			width:"100%",
			height:37
		},
		children:"Red"
	},
	Two: {
		kind: "div",
		style: {
			backgroundColor: "green",
			width:"100%",
			height:37
		},
		children:"Green"
	},
	Three: {
		kind: "div",
		style: {
			backgroundColor: "blue",
			width:"100%",
			height:37
		},
		children:"Blue"
	},
	Four: {
		kind: "div",
		style: {
			backgroundColor: "orange",
			width:"100%",
			height:37
		},
		children:"Orange"
	},


	Above: {
		kind: "div",
		style: {
			backgroundColor:"pink",
			//width:"100%",
			padding:"11px"
		},
		className:"above"
	},
	Below: {
		kind: "div",
		style: {
			backgroundColor:"cyan",
			padding:"5px"
		},
		className: "below"
	},
	Wrappers: {
		kind: "div",
		style: {
			backgroundColor:"brown",
			outline:"1px solid yellow",
			paddingLeft:"25px"
		},
		className:"wrappers"
	},
	Before: {
		kind: "div",
		style: {
			backgroundColor:"lightblue",
			width:"100%",
			height:"57px"
		},
		className:"before"
	},
	After: {
		kind: "div",
		style: {
			backgroundColor:"lightgreen",
			width:"100%",
			height:"57px"
		},
		className: "after"
	},
	Between: {
		kind: "div",
		style: {
			backgroundColor:"lightgray",
			width:"100%",
			height:"7px"
		},
		className:"between"
	},
	Header: {
		kind: "div",
		style: {
			backgroundColor:"black",
			width:"100%",
			height:"7px"
		},
		className:"header"
	},
	Footer: {
		kind: "div",
		style: {
			backgroundColor:"white",
			width:"100%",
			height:"7px"
		},
		className:"footer"
	}

};
*/



const oneToNone = {
	pointerId: "pointerNode",
	representedId: "representedObject"
};
const oneToOne = {
	partnerId: {
		toOne:"partnerNode",
		inverse:"partnerInverse"
	}
};
const oneToMany = {
	childIds: {
		toMany:"childNodes",
		toOne:"parentNode",
		header:"header",
		footer:"footer",
		between:"between",
		wrappers:"wrappers",
		before:"before",
		after:"after",
		above:"above",
		below:"below",
		visible:"visible"
	},
	choiceIds: {
		toMany:"choiceNodes",
		toOne:"chooserNode"
	}
};
const relationships = {
	oneToNone,
	oneToOne,
	oneToMany
};

// class ViewModel {
// 	constructor(nodes,relationships) {
// 		this.relationships = relationships;
// 		this.nodes = observable(nodes);
// 		extendObservable(this, {
// 			graph: computed(function() {
// 				return transformer(relationships)(this.nodes);
// 			})
// 		});
// 	}
// }
// const store = new ViewModel(views,relationships);



const store = new ViewModel(views,relationships);

// var upperCaseName = computed(() =>
// 	name.get().toUpperCase()
// );
// var disposer = upperCaseName.observe(change => console.log(change.newValue));

//computed(expression).observe(action(sideEffect)) or autorun(() => action(sideEffect)(expression)


// autorun(() => {
// 	if (store.graph["InnerSplit"].dividerRatio === 0) console.log("zero");
// });

// console.log("store:",store);
// const graph = store.graph;
// console.log("graph:",graph);
// const node = graph["ContentView"];
// console.log("contentView:",node);


// store.nodes["Another"] = {
// 	kind:"div",
// 	style: {
// 		backgroundColor:"green"
// 	}
// }


render(<App store={store} />, document.getElementById("root"));

// let i = 10000;
// while (i--) {
// 	store.graph["InnerSplit"].mutable.dividerRatio = i / 10000;
// }
// console.log("done");

