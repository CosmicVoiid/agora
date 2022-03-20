import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "../components/Navbar";
import Postform from "../components/Postform";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import SidebarFriends from "../components/SidebarFriends";
import "./UserDetail.css";

function UserDetail() {
	const { user, setUser } = useContext(UserContext);
	const [currentUser, setCurrentUser] = useState(null);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("http://localhost:5000/user", {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const userData = await response.json();
				// console.log(`get user user data ${JSON.stringify(userData)}`);
				if (userData.success === false) {
					setUser(null);
					navigate("/login");
					return;
				} else {
					setUser(userData.user);
					fetchUserDetails();
				}
			} catch (err) {
				navigate("/login");
				return;
			}
		};

		const fetchUserDetails = async () => {
			try {
				const response = await fetch(`http://localhost:5000/user/${id}`, {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const userData = await response.json();
				// console.log(`get user user data ${JSON.stringify(userData)}`);
				if (userData.success === false) {
					console.log("error");
				} else {
					console.log(userData);
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchUser();
	}, []);

	return (
		<div className="user-details-container">
			{user !== null && currentUser !== null && <div>hi</div>}
		</div>
	);
}

export default UserDetail;
