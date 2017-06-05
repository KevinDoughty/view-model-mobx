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
export default relationships;