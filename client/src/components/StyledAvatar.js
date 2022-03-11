import React, { useContext } from "react";
import { Avatar } from "@mui/material";
import { UserContext } from "../UserContext";

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

function StyledAvatar() {
	const { user } = useContext(UserContext);

	return (
		<div>
			{(user !== null || user !== undefined) && (
				<div>
					{user.profile_picture_url !== undefined && (
						<Avatar
							alt={user.first_name + " " + user.last_name}
							src={user.profile_picture_url}
							sx={styles.avatar}
						></Avatar>
					)}

					{user.profile_picture_url === undefined && (
						<Avatar
							alt={user.first_name + " " + user.last_name}
							sx={styles.avatar}
						>
							{user.first_name[0]}
						</Avatar>
					)}
				</div>
			)}
		</div>
	);
}

export default StyledAvatar;
