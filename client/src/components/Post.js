import React from "react";
import { Avatar } from "@mui/material";
import "./Post.css";

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

const options = { year: "numeric", month: "long", day: "numeric" };

function Post(props) {
	return (
		<div className="post-container">
			<div className="post-container__header">
				{props.profileURL !== undefined && (
					<Avatar
						sx={styles.avatar}
						alt={props.name}
						src={props.profileURL}
					></Avatar>
				)}
				{props.profileURL === undefined && (
					<Avatar sx={styles.avatar} alt={props.name}>
						{props.name[0]}
					</Avatar>
				)}
				<div className="header-info">
					<h3>{props.name}</h3>
					<p>{new Date(props.date).toLocaleDateString(undefined, options)}</p>
				</div>
			</div>
			<div className="post-container__body">{props.body}</div>
		</div>
	);
}

export default Post;
