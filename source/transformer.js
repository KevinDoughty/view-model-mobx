//import { observable, toJS, createTransformer, computed } from "mobx";
import { observable, toJS } from "mobx";

// A computed within a computed?


function relate(node, property, value) {
	node[property] = value;
	//node[property] = computed(() => value);
}

function getter(object,key) {
	return object[key];
	//return object.get(key);
}

function setter(object,key,value) {
	object[key] = value;
	//object.set(key,value);
}

function itemTransformer(result,source,key) {
	//return createTransformer( (item) => {
	return ( item => {
		const node = (Object.assign(
			toJS(item),
			{
				id:key,
				key:key,
				mutable:item
			}
		));
		return node;
	});
}

export function transformer(relationships) {
	const oneToMany = relationships.oneToMany || {};
	const oneToNone = relationships.oneToNone || {};
	//return createTransformer( source => {
	return ( source => {
		//console.log("transformation source:",source);
//		const result = observable.shallowMap({});
		const result = observable.shallow({});

		Object.keys(source).forEach( key => {
			const raw = getter(source,key);
			const item = itemTransformer(result,source,key)(raw);
			setter(result,key,item);
		});

		Object.keys(source).forEach( key => {
			const nodeId = key;
			const node = getter(result,key);
// 			const raw = getter(source,key); // Experimental, should get childIds from the observable and relate should use computed... somehow

			Object.keys(oneToNone).forEach( property => {
				const pointerId = node[property];
				relate(node, oneToNone[property], getter(result, pointerId));
			});

			Object.keys(oneToMany).forEach( property => {
				const relationship = oneToMany[property]; // <-- relationship
				const childIds = node[property] || []; // <----- childIds
// 				const childIds = raw[property] || []; // <----- childIds

				const toMany = relationship.toMany;
				const toOne = relationship.toOne;

				const header = node[relationship.header]; // applies to children
				const footer = node[relationship.footer]; // applies to children
				const between = node[relationship.between]; // applies to children
				const wrappers = node[relationship.wrappers]; // applies to children
				const visible = node[relationship.visible]; // applies to children
				const below = node[relationship.below]; // applies to self
// 				const header = raw[relationship.header]; // applies to children
// 				const footer = raw[relationship.footer]; // applies to children
// 				const between = raw[relationship.between]; // applies to children
// 				const wrappers = raw[relationship.wrappers]; // applies to children
// 				const visible = raw[relationship.visible]; // applies to children
// 				const below = raw[relationship.below]; // applies to self

				let visibleIds = [];
				if (Array.isArray(visible)) { // if not undefined, final version will either be an array only, or mobx observable array only. This is needed only because this is a work in progress and I haven't decided which
					visible.forEach( (item,index) => {
						if (!Number.isNaN(item) && item < childIds.length) visibleIds.push(childIds[item]);
					});
				} else if (visible) { // if not undefined, final version will either be an array only, or mobx observable array only. This is needed only because this is a work in progress and I haven't decided which
					toJS(visible).forEach( (item,index) => {
						if (!Number.isNaN(item) && item < childIds.length) visibleIds.push(childIds[item]);
					});
				} else visibleIds = childIds;
				const array = [];

				if (header) {
					const pseudo = Object.assign({}, getter(result,header));
					array.push(pseudo);
				}

				visibleIds.forEach( (id,index) => {

					const child = getter(result,id);
// 					const from = getter(source,id); // Experimental, should get childIds from the observable and relate should use computed... somehow

					const before = child[relationship.before]; // applies to self
					const after = child[relationship.after]; // applies to self
					const above = child[relationship.above]; // applies to self
					//const below = child[relationship.below]; // applies to self
// 					const before = from[relationship.before]; // applies to self
// 					const after = from[relationship.after]; // applies to self
// 					const above = from[relationship.above]; // applies to self
// 					//const below = from[relationship.below]; // applies to self



					if (index && between) {
						const pseudo = Object.assign({}, getter(result,between), {key:""+nodeId+between+index}); // copy
						array.push(pseudo);
					}

					if (before) {
						const pseudo = Object.assign({}, getter(result,before));
						array.push(pseudo);
					}
					if (above) {
						const pseudo = Object.assign({}, getter(result,above));
						relate(pseudo, toMany, [child]);
						relate(child, toOne, pseudo);

						array.push(pseudo);
					} else {
						array.push(child);
					}

					if (after) {
						const pseudo = Object.assign({}, getter(result,after));
						array.push(pseudo);
					}
				});

				if (footer) {
					const pseudo = Object.assign({}, getter(result,footer));
					array.push(pseudo);
				}

				if (below) {
					const pseudo = Object.assign({}, getter(result,below));
					if (wrappers) {
						const wraps = [];
						array.forEach( (child,index) => {
							const subPseudo = Object.assign({}, getter(result,wrappers), {key:""+nodeId+wrappers+index});
							relate(subPseudo, toMany, [child]);
							relate(child, toOne, subPseudo);
							relate(subPseudo, toOne, pseudo);
							wraps.push(subPseudo);
						});
						relate(node, toMany, [pseudo]);
						relate(pseudo, toOne, node);
						relate(pseudo, toMany, wraps);
					} else {
						relate(node, toMany, [pseudo]);
						relate(pseudo, toOne, node);

						relate(pseudo, toMany, array);
						array.forEach( (child) => {
							relate(child, toOne, pseudo);
						});
					}
				} else {
					if (wrappers) {
						const wraps = [];
						array.forEach( (child,index) => {
							const pseudo = Object.assign({}, getter(result,wrappers), {key:""+nodeId+wrappers+index});
							relate(pseudo, toMany, [child]);
							relate(child, toOne, pseudo);
							relate(pseudo, toOne, node);
							wraps.push(pseudo);
						});
						relate(node, toMany, wraps);
					} else {
						relate(node, toMany, array);
						array.forEach( (child) => {
							relate(child, toOne, node);
						});
					}
				}
			});
		});
		//console.log("transformation result:",result);
		return result;
	});
}






/*
function nodeTransformer(result,source,key) {
	//return createTransformer( (item) => {
	return item => item;
// 	return ( item => {
// 		const node = (Object.assign(
// 		toJS(item),
// 		{
// 			id:key,
// 			key:key,
// 			mutable:item
// 		}));
// 		return node;
// 	});
}



export function graphTransformer(relationships,original) {
	const oneToMany = relationships.oneToMany || {};
	const oneToNone = relationships.oneToNone || {};
	//return createTransformer( source => {
	return ( source => {
		const result = observable.shallow({});

		Object.keys(source).forEach( key => {
			const sourceRaw = getter(source,key);
			const item = Object.assign(
				{},
				sourceRaw
			);
			setter(result, key, item);
		});
		Object.keys(result).forEach( key => {
			const sourceRaw = getter(source,key);
			const originalRaw = getter(original,key);
			const resultRaw = getter(result,key);
			
			const mutable = {};
			Object.keys(resultRaw).forEach( property => {
				Object.defineProperty(mutable, property, {
					get: function() {
						return sourceRaw[property];
					},
					set: function(value) {
						sourceRaw[property] = value;
					},
					enumerable: true,
					configurable: true
				});
			});
			Object.keys(oneToNone).forEach( property => {
				if (resultRaw[property]) {
					Object.defineProperty(mutable, property, {
						get: function() {
							return originalRaw[property];
						},
						set: function(value) {
							originalRaw[property] = value;
						},
						enumerable: true,
						configurable: true
					});
				}
			});

			Object.keys(oneToMany).forEach( property => {
				if (resultRaw[property]) {
					Object.defineProperty(mutable, property, {
						get: function() {
							return originalRaw[property];
						},
						set: function(value) {
							originalRaw[property] = value;
						},
						enumerable: true,
						configurable: true
					});
				}
			});
			resultRaw.mutable = mutable;
		});
		console.log("graph:",result);
		return result;
	});
}


export function hierarchyTransformer(relationships) {
	const oneToMany = relationships.oneToMany || {};
	const oneToNone = relationships.oneToNone || {};
	//return createTransformer( source => {
	return ( source => {
		//console.log("transformation source:",source);
//		const result = observable.shallowMap({});
		const result = observable.shallow({});

		Object.keys(source).forEach( key => {
			const raw = getter(source,key);
			const item = itemTransformer(result,source,key)(raw);
			setter(result,key,item);
		});

		Object.keys(source).forEach( key => {
			const nodeId = key;
			const node = getter(result,key);
			const raw = getter(source,key); // Experimental, should get childIds from the observable and relate should use computed... somehow

			Object.keys(oneToNone).forEach( property => {
				const pointerId = node[property];
				relate(node, oneToNone[property], getter(result, pointerId));
			});

			Object.keys(oneToMany).forEach( property => {
				const relationship = oneToMany[property]; // <-- relationship
				const childIds = node[property] || []; // <----- childIds
// 				const childIds = raw[property] || []; // <----- childIds

				const toMany = relationship.toMany;
				const toOne = relationship.toOne;

				const header = node[relationship.header]; // applies to children
				const footer = node[relationship.footer]; // applies to children
				const between = node[relationship.between]; // applies to children
				const wrappers = node[relationship.wrappers]; // applies to children
				const visible = node[relationship.visible]; // applies to children
				const below = node[relationship.below]; // applies to self
// 				const header = raw[relationship.header]; // applies to children
// 				const footer = raw[relationship.footer]; // applies to children
// 				const between = raw[relationship.between]; // applies to children
// 				const wrappers = raw[relationship.wrappers]; // applies to children
// 				const visible = raw[relationship.visible]; // applies to children
// 				const below = raw[relationship.below]; // applies to self

				let visibleIds = [];
				if (Array.isArray(visible)) { // if not undefined, final version will either be an array only, or mobx observable array only. This is needed only because this is a work in progress and I haven't decided which
					visible.forEach( (item,index) => {
						if (!Number.isNaN(item) && item < childIds.length) visibleIds.push(childIds[item]);
					});
				} else if (visible) { // if not undefined, final version will either be an array only, or mobx observable array only. This is needed only because this is a work in progress and I haven't decided which
					toJS(visible).forEach( (item,index) => {
						if (!Number.isNaN(item) && item < childIds.length) visibleIds.push(childIds[item]);
					});
				} else visibleIds = childIds;
				const array = [];

				if (header) {
					const pseudo = Object.assign({}, getter(result,header));
					array.push(pseudo);
				}

				visibleIds.forEach( (id,index) => {

					const child = getter(result,id);
					const from = getter(source,id); // Experimental, should get childIds from the observable and relate should use computed... somehow

					const before = child[relationship.before]; // applies to self
					const after = child[relationship.after]; // applies to self
					const above = child[relationship.above]; // applies to self
					//const below = child[relationship.below]; // applies to self
// 					const before = from[relationship.before]; // applies to self
// 					const after = from[relationship.after]; // applies to self
// 					const above = from[relationship.above]; // applies to self
// 					//const below = from[relationship.below]; // applies to self



					if (index && between) {
						const pseudo = Object.assign({}, getter(result,between), {key:""+nodeId+between+index}); // copy
						array.push(pseudo);
					}

					if (before) {
						const pseudo = Object.assign({}, getter(result,before));
						array.push(pseudo);
					}
					if (above) {
						const pseudo = Object.assign({}, getter(result,above));
						relate(pseudo, toMany, [child]);
						relate(child, toOne, pseudo);

						array.push(pseudo);
					} else {
						array.push(child);
					}

					if (after) {
						const pseudo = Object.assign({}, getter(result,after));
						array.push(pseudo);
					}
				});

				if (footer) {
					const pseudo = Object.assign({}, getter(result,footer));
					array.push(pseudo);
				}

				if (below) {
					const pseudo = Object.assign({}, getter(result,below));
					if (wrappers) {
						const wraps = [];
						array.forEach( (child,index) => {
							const subPseudo = Object.assign({}, getter(result,wrappers), {key:""+nodeId+wrappers+index});
							relate(subPseudo, toMany, [child]);
							relate(child, toOne, subPseudo);
							relate(subPseudo, toOne, pseudo);
							wraps.push(subPseudo);
						});
						relate(node, toMany, [pseudo]);
						relate(pseudo, toOne, node);
						relate(pseudo, toMany, wraps);
					} else {
						relate(node, toMany, [pseudo]);
						relate(pseudo, toOne, node);

						relate(pseudo, toMany, array);
						array.forEach( (child) => {
							relate(child, toOne, pseudo);
						});
					}
				} else {
					if (wrappers) {
						const wraps = [];
						array.forEach( (child,index) => {
							const pseudo = Object.assign({}, getter(result,wrappers), {key:""+nodeId+wrappers+index});
							relate(pseudo, toMany, [child]);
							relate(child, toOne, pseudo);
							relate(pseudo, toOne, node);
							wraps.push(pseudo);
						});
						relate(node, toMany, wraps);
					} else {
						relate(node, toMany, array);
						array.forEach( (child) => {
							relate(child, toOne, node);
						});
					}
				}
			});
		});
		console.log("hierarchy:",result);
		return result;
	});
}
*/