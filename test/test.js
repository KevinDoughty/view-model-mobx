import { transformer } from "../source/transformer.js";
import { extendObservable, computed, observable, autorun } from "mobx";
const assert = require("assert");

// import BasicView from "../source/BasicView";
// import PairView from "../source/PairView";
// //import ControlView from "../source/ControlView";
// import ListHeader from "../source/ListHeader";
// import ListView from "../source/ListView";
// import GridHeader from "../source/GridHeader";
// //import GridView from "../source/GridView";
// import SegmentedControl from "../source/SegmentedControl";

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

// const done = function() {
// 	// This is a bug fix, the first completion handler produces both an error for being undefined, and a pass for the exact same test ?!
// };

class ViewModel {
	constructor(nodes,relationships) {
		this.relationships = relationships;
		extendObservable(this, {
			nodes: observable(nodes),
			graph: computed(function() {
				return transformer(relationships)(this.nodes);
			})
		});
	}
}

const oneToNone = {
	pointerId: "pointerNode"
};
// const oneToOne = {
// 	partnerId: {
// 		toOne:"partnerNode",
// 		inverse:"partnerInverse"
// 	}
// };
const oneToMany = {
	childIds : {
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
	}
};
const relationships = {
	oneToNone,
// 	oneToOne,
	oneToMany
};

const views = {
	ContentView: {
		kind: "PairView",
		vertical:true,
		childIds:["SegmentedControl","InnerSplit"]
	},
	SegmentedControl: {
		kind: "SegmentedControl",
		height : 60,
		pointerId:"GridView"
	},


	InnerSplit: {
		kind: "PairView",
		dividerWidth: 9,
		dividerRatio: 0.25,
		visible:[0,1],
		childIds:["ListPane", "GridPane"]
	},

	ListPane: {
		kind: "PairView",
		vertical: true,
		childIds:["ListHeader", "ListView"]
	},


	ListHeader: {
		kind: "ListHeader",
		height: 55 // pairViewHeight
	},
	ListView: {
		kind: "ListView",
		margin: 9,
		dimension: 20,
		inset: 7
	},



	GridPane: {
		kind: "PairView",
		vertical: true,
		childIds:["GridHeader", "GridView"]
	},


	GridHeader: {
		kind: "GridHeader",
		height: 55 // pairViewHeight
	},


	GridView: {
		kind: "BasicView",
// 		style: {
// 			backgroundColor:"purple",
// 			padding:"15px"
// 		},
		className:"container",
		childIds: ["One","Two","Three","Four"],

		visible:[],

// before & after won't work as children of PairView. Consider making above also wrap before & after

// 		before:"Before", // self
// 		after:"After", // self
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


	Above: {
		kind: "BasicView", // can't be a plain div because PairView passes frame
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


describe("tests", function() {
	it("function", function() {
		assert(isFunction(function() {}));
		assert(!isFunction({}));
		assert(!isFunction("[object Function]"));
	});
	it("assert", function() {
		assert.equal(1,1);
	});
	it("ViewModel class", function() {
		const viewModel = new ViewModel(views,relationships);
		assert(viewModel !== null && typeof viewModel !== "undefined");
	});
	
	// The following tests are pointless, the problem is with mobx-react mixin:
	
// 		it("ViewModel stack overflow", function(done) {
// 			this.timeout(0);
// 			const viewModel = new ViewModel(views,relationships);
// 			let i = 10000;
// 			while (i--) {
// 				viewModel.graph["InnerSplit"].mutable.dividerRatio = i/10000;
// 			}
// 			let error = null;
// 			if (viewModel.graph["InnerSplit"].dividerRatio !== 0) error = new Error("dividerRatio:"+viewModel.graph["InnerSplit"].dividerRatio);
// 			done(error);
// 		});
// 		it("ViewModel stack overflow with autorun", function(done) {
// 			this.timeout(0);
// 			const viewModel = new ViewModel(views,relationships);
// 			let i = 10000;
// 			let error = null;
// 			autorun(() => {
// 				if (viewModel.graph["InnerSplit"].dividerRatio === 0) console.log("zero");
// 			});
// 			while (i--) {
// 				viewModel.graph["InnerSplit"].mutable.dividerRatio = i/10000;
// 			}
// 			
// 			if (error === null && viewModel.graph["InnerSplit"].dividerRatio !== 0) error = new Error("dividerRatio:"+viewModel.graph["InnerSplit"].dividerRatio);
// 			done(error);
// 		});
});