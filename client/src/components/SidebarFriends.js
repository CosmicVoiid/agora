import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Avatar } from "@mui/material";
import "./SidebarFriends.css";

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

function SidebarFriends() {
	const { user, setUser } = useContext(UserContext);
	const [allFriends, setAllFriends] = useState([]);

	useEffect(() => {
		const getFriends = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/user/${user._id}/friends`,
					{
						method: "GET",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					}
				);

				const data = await response.json();
				const friendArray = [];
				if (data.success) {
					for (let i in data.friends) {
						friendArray.push(data.friends[i].recipient);
					}
					setAllFriends(friendArray);
				}
			} catch (err) {
				console.log(err);
			}
		};

		getFriends();
	}, []);
	return (
		<div className="sidebar-friends">
			<h1 className="sidebar-category sidebar-category__top">
				Friend Requests
			</h1>
			<h1 className="sidebar-category">Friends</h1>
			{allFriends.map((friend) => {
				return (
					<div key={friend._id} className="friend-container">
						{friend.profile_picture_url === undefined && (
							<Avatar
								alt={friend.first_name + " " + friend.last_name}
								sx={styles.avatar}
							>
								{friend.first_name[0]}
							</Avatar>
						)}

						{friend.profile_picture_url !== undefined && (
							<Avatar
								alt={friend.first_name + " " + friend.last_name}
								src={friend.profile_picture_url}
								sx={styles.avatar}
							/>
						)}

						<h3 className="friend-name">
							{friend.first_name + " " + friend.last_name}
						</h3>
					</div>
				);
			})}
		</div>
	);
}

export default SidebarFriends;
