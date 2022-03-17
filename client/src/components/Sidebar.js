import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Sidebar.css";

function Sidebar() {
	const [selected, setSelected] = useState("");

	const handleSelected = (selection) => {
		setSelected(selection);
	};
	return (
		<div className="sidebar">
			<div
				className={
					"sidebar-header-top-container sidebar-element " +
					(selected === "Feed" && "selected-header")
				}
				onClick={() => handleSelected("Feed")}
			>
				<FontAwesomeIcon icon="fa-solid fa-newspaper" className="icon" />
				<h3 className="sidebar-header">Feed</h3>
			</div>
			<h1 className="sidebar-category">Explore</h1>
			<div
				className={
					"sidebar-element " + (selected === "Users" && "selected-header")
				}
				onClick={() => handleSelected("Users")}
			>
				<FontAwesomeIcon icon="fa-solid fa-users" className="icon" />
				<h3 className="sidebar-header">Users</h3>
			</div>
			<div
				className={
					"sidebar-element " + (selected === "Posts" && "selected-header")
				}
				onClick={() => handleSelected("Posts")}
			>
				<FontAwesomeIcon icon="fa-solid fa-inbox" className="icon" />
				<h3 className="sidebar-header">Posts</h3>
			</div>
		</div>
	);
}

export default Sidebar;
