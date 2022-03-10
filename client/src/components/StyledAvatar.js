import React from "react";
import { Avatar } from "@mui/material";

const styles = {
	avatar: {
		border: "1px solid #d6a37c",
		color: "#d6a37c",
		backgroundColor: "#2f3d58",
		margin: "0 5px",
		transition: "filter 300ms",
		":hover": {
			cursor: "pointer",
			filter: "brightness(1.2)",
		},
	},
};

function StyledAvatar(props) {
	return (
		<div>
			{props.profileURL !== undefined && (
				<Avatar
					alt={props.name}
					src={props.profileURL}
					sx={styles.avatar}
				></Avatar>
			)}

			{props.profileURL === undefined && (
				<Avatar alt={props.name} sx={styles.avatar}>
					{props.name[0]}
				</Avatar>
			)}
		</div>
	);
}

export default StyledAvatar;
