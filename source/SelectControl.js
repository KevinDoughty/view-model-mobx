import React, { Component } from "react";

const SelectControl = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handleChange:this.handleChange.bind(this)
		};
	}
	handleChange(e) {
		const node = this.props.representedObject;
		const choiceIds = this.props.choiceIds;
		const value = e.target.value;
		node.mutable.below = value;
	}
	render() {
		const node = this.props.representedObject;
		const choiceIds = this.props.choiceIds || [];
		const array = [];
		choiceIds.forEach( choiceId => {
			array.push(
				<option value={choiceId} key={choiceId}>{choiceId}</option>
			);
		});
		const style = { display: "inline", marginLeft:"20px" };
		const selected = node.below;
		return (
			<select style={style} value={selected} onChange={this.state.handleChange}>
				{array}
			</select>
		);
	}
});
export default SelectControl;