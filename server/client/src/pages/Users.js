import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Avatar } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarFriends from "../components/SidebarFriends";
import "./Users.css";

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

function Users() {
	const { user, setUser } = useContext(UserContext);
	const [allUsers, setAllUsers] = useState([]);
	const [allNames, setAllNames] = useState([]);
	const [needsUpdate, setNeedsUpdate] = useState(true);
	const navigate = useNavigate();

	const checkFriendStatus = (id, jsx) => {
		for (let i in user.friends) {
			console.log(user.friends[i]);
			if (
				user.friends[i].recipient === id &&
				user.friends[i].requester === user._id &&
				user.friends[i].status === "requested"
			) {
				if (jsx) return <p>Cancel Request</p>;
				else return "requested";
			} else if (user.friends[i].status === "friend") {
				if (jsx) return <p>Remove Friend</p>;
				else return "friend";
			} else if (
				user.friends[i].requester === user._id &&
				user.friends[i].recipient === id &&
				user.friends[i].status === "pending"
			) {
				if (jsx) return <p>Accept Request</p>;
				else return "pending";
			} else {
				if (jsx) return <p>Add Friend</p>;
				else return "add";
			}
		}

		if (user.friends.length === 0) {
			if (jsx) return <p>Add Friend</p>;
			else return "add";
		}
	};

	const handleChangeFriendStatus = async (id) => {
		if (checkFriendStatus(id, false) === "add") {
			try {
				const response = await fetch(
					`https://agora-atlas.herokuapp.com/api/user/${user._id}/friend`,
					{
						method: "POST",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ userB: id }),
					}
				);

				const data = await response.json();
				if (data.success) {
					console.log("success");
					setNeedsUpdate(true);
				}
			} catch (err) {
				console.log(err);
			}
		} else if (checkFriendStatus(id, false) === "pending") {
			try {
				const response = await fetch(
					`https://agora-atlas.herokuapp.com/api/user/${user._id}/friend`,
					{
						method: "PUT",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ userB: id }),
					}
				);

				const data = await response.json();
				if (data.success) {
					console.log("success");
					setNeedsUpdate(true);
				}
			} catch (err) {
				console.log(err);
			}
		} else if (checkFriendStatus(id, false) === "requested") {
			try {
				const response = await fetch(
					`https://agora-atlas.herokuapp.com/api/user/${user._id}/friend`,
					{
						method: "DELETE",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ userB: id }),
					}
				);

				const data = await response.json();
				if (data.success) {
					console.log("success");
					setNeedsUpdate(true);
				}
			} catch (err) {
				console.log(err);
			}
		} else if (checkFriendStatus(id, false) === "friend") {
			try {
				const response = await fetch(
					`https://agora-atlas.herokuapp.com/api/user/${user._id}/friend`,
					{
						method: "DELETE",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ userB: id }),
					}
				);

				const data = await response.json();
				if (data.success) {
					console.log("success");
					setNeedsUpdate(true);
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	useEffect(() => {
		//Fetch user from api
		if (needsUpdate) {
			const fetchUser = async () => {
				try {
					const response = await fetch(
						"https://agora-atlas.herokuapp.com/api/user",
						{
							method: "GET",
							mode: "cors",
							headers: {
								"Content-Type": "application/json",
							},
							credentials: "include",
						}
					);

					const userData = await response.json();
					// console.log(`get user user data ${JSON.stringify(userData)}`);
					if (userData.success === false) {
						setUser(null);
						navigate("/login");
						return;
					} else {
						setUser(userData.user);
						fetchUsers();
					}
				} catch (err) {
					navigate("/login");
					return;
				}
			};

			const fetchUsers = async () => {
				try {
					const response = await fetch(
						"https://agora-atlas.herokuapp.com/api/users",
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
					console.log(data.users);
					if (data.success) {
						const usernameArray = [];
						for (let i in data.users) {
							usernameArray.push({
								label: data.users[i].first_name + " " + data.users[i].last_name,
								id: data.users[i]._id,
							});
						}

						setAllNames(usernameArray);
						setAllUsers(data.users);
					}
				} catch (err) {
					console.log(err);
				}
			};

			fetchUser();
			setNeedsUpdate(false);
		}
	}, [needsUpdate]);

	return (
		<div>
			{user !== null && (
				<div className="users">
					<Navbar first_name={user.first_name} users={allNames}></Navbar>
					<Sidebar defaultSelection="Users" />
					<div className="users-container">
						<div className="users-box">
							<div className="users-box__left">
								<Link to={"/user/" + user._id}>
									{user.profile_picture_url === undefined && (
										<Avatar
											alt={user.first_name + " " + user.last_name}
											sx={styles.avatar}
										>
											{user.first_name[0]}
										</Avatar>
									)}

									{user.profile_picture_url !== undefined && (
										<Avatar
											alt={user.first_name + " " + user.last_name}
											src={user.profile_picture_url}
											sx={styles.avatar}
										/>
									)}
								</Link>

								<p className="users-box__name">
									{user.first_name + " " + user.last_name}
								</p>
							</div>
						</div>

						{allUsers.map((currentUser) => {
							return (
								<div key={currentUser._id}>
									{currentUser._id !== user._id && (
										<div key={currentUser._id} className="users-box">
											<div className="users-box__left">
												<Link to={"/user/" + currentUser._id}>
													{currentUser.profile_picture_url === undefined && (
														<Avatar
															alt={
																currentUser.first_name +
																" " +
																currentUser.last_name
															}
															sx={styles.avatar}
														>
															{currentUser.first_name[0]}
														</Avatar>
													)}

													{currentUser.profile_picture_url !== undefined && (
														<Avatar
															alt={
																currentUser.first_name +
																" " +
																currentUser.last_name
															}
															src={currentUser.profile_picture_url}
															sx={styles.avatar}
														/>
													)}
												</Link>

												<p className="users-box__name">
													{currentUser.first_name + " " + currentUser.last_name}
												</p>
											</div>
											<div className="users-box__right">
												<button
													className="friend-btn icon"
													onClick={() =>
														handleChangeFriendStatus(currentUser._id)
													}
												>
													{checkFriendStatus(currentUser._id, true)}
												</button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
					<SidebarFriends />
				</div>
			)}
		</div>
	);
}

export default Users;
