import BasicView from "./BasicView";
import PairView from "./PairView";
import ListHeader from "./ListHeader";
import ListView from "./ListView";
import GridHeader from "./GridHeader";
//import GridView from "./GridView";
import SegmentedControl from "./SegmentedControl";
import SelectControl from "./SelectControl";


const hierarchy = {
	ContentView: {
		kind: PairView,
		vertical:true,
		childIds:["ControlView","InnerSplit"]
	},
	ControlView: {
		kind: BasicView,
		height:30,
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
			backgroundColor:"darkgrey"
		},
		className:"container",
		childIds: ["One","Two","Three","Four"],

		visible:[],

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
			paddingTop:"150px",
			paddingBottom:"150px",
			width:"100%",
			position:"relative"
		},
		className: "purple"
	},
	Pink: {
		kind: "div",
		style: {
			backgroundColor:"pink",
			paddingTop:"150px",
			paddingBottom:"150px",
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
export default hierarchy;