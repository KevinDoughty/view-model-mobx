import React, { Component } from "react";

const ListHeader = (class extends Component {
	render() {
		const style = {
			left: this.props.frame.origin.x+"px",
			top: this.props.frame.origin.y+"px",
			width: this.props.frame.size.width+"px",
			height: this.props.frame.size.height+"px",
			position:"absolute",
			backgroundColor:"white"
		};
		return (
			<div style={style}>
				{this.props.id+""}
			</div>
		);
	}
});
export default ListHeader;