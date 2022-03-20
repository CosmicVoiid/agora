import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar(props) {
	const [selected, setSelected] = useState(props.defaultSelection);

	const handleSelected = (selection) => {
		setSelected(selection);
	};
	return (
		<div className="sidebar">
			<Link
				to="/home"
				className={
					"sidebar-header-top-container sidebar-element " +
					(selected === "Feed" && "selected-header")
				}
				onClick={() => handleSelected("Feed")}
			>
				<FontAwesomeIcon icon="fa-solid fa-newspaper" className="icon" />
				<h3 className="sidebar-header">Feed</h3>
			</Link>
			<h1 className="sidebar-category">Explore</h1>
			<Link
				to="/users"
				className={
					"sidebar-element " + (selected === "Users" && "selected-header")
				}
				onClick={() => handleSelected("Users")}
			>
				<FontAwesomeIcon icon="fa-solid fa-users" className="icon" />
				<h3 className="sidebar-header">Users</h3>
			</Link>
			<Link
				to="/posts"
				className={
					"sidebar-element " + (selected === "Posts" && "selected-header")
				}
				onClick={() => handleSelected("Posts")}
			>
				<FontAwesomeIcon icon="fa-solid fa-inbox" className="icon" />
				<h3 className="sidebar-header">All Posts</h3>
			</Link>
		</div>
	);
}

export default Sidebar;
