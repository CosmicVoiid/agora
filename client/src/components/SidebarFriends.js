import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
	const { user } = useContext(UserContext);
	const [allFriends, setAllFriends] = useState([]);
	const [clicked, setClicked] = useState(false);

	const handleClick = () => {
		clicked ? setClicked(false) : setClicked(true);
	};

	useEffect(() => {
		const getFriends = async () => {
			try {
				const response = await fetch(
					`https://agora-atlas.herokuapp.com/api/user/${user._id}/friends`,
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
		<div>
			<div
				className={
					"friend-bar-menu-container icon " +
					(clicked && "friend-bar-menu-container-clicked")
				}
				onClick={handleClick}
			>
				<FontAwesomeIcon icon="fa-solid fa-user-group" />
			</div>

			<div
				className={"sidebar-friends " + (clicked && "sidebar-friends-clicked")}
			>
				<h1 className="sidebar-category sidebar-category__top">
					Friend Requests
				</h1>
				<h1 className="sidebar-category">Friends</h1>
				{allFriends.map((friend) => {
					return (
						<div key={friend._id} className="friend-container">
							<Link to={"/user/" + friend._id}>
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
							</Link>

							<h3 className="friend-name">
								{friend.first_name + " " + friend.last_name}
							</h3>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SidebarFriends;
