import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { Avatar } from "@mui/material";
import "./UserDetail.css";

const styles = {
	avatar: {
		border: "2px solid #d6a37c",
		color: "#d6a37c",
		backgroundColor: "#2f3d58",
		margin: "0 5px",
		transition: "filter 300ms",
		width: "13rem",
		height: "13rem",
		fontSize: "3rem",
		position: "absolute",
		transform: "translateY(-35%)",
		":hover": {
			cursor: "pointer",
			filter: "brightness(1.2)",
		},
	},
	avatarBox: {
		border: "2px solid #d6a37c",
		color: "#d6a37c",
		backgroundColor: "#2f3d58",
		margin: "1rem",
		transition: "filter 300ms",
		height: "4rem",
		width: "4rem",
		fontSize: "2rem",
		":hover": {
			cursor: "pointer",
			filter: "brightness(1.2)",
		},
	},
};

function UserDetail() {
	const { user, setUser } = useContext(UserContext);
	const [currentUser, setCurrentUser] = useState(null);
	const [currentUserPosts, setCurrentUserPosts] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [allFriends, setAllFriends] = useState([]);
	const [needsUpdate, setNeedsUpdate] = useState(true);
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
					setCurrentUser(userData.user);
					fetchUsers();
					getFriends(userData.user._id);
					console.log(userData);
				}
			} catch (err) {
				console.log(err);
			}
		};

		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:5000/users", {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const postsData = await response.json();
				console.log(postsData);
				if (postsData.success) {
					const usernameArray = [];
					for (let i in postsData.users) {
						usernameArray.push(
							postsData.users[i].first_name + " " + postsData.users[i].last_name
						);
					}
					setAllUsers(usernameArray);
				}
			} catch (err) {
				console.log(err);
			}
		};

		const getFriends = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/user/${id}/friends`,
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

		fetchUser();
		update();
	}, [id]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(`http://localhost:5000/post/user/${id}`, {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const data = await response.json();
				if (data.success) {
					setCurrentUserPosts(data.results);
					setNeedsUpdate(false);
				}
			} catch (err) {
				console.log(err);
			}
		};

		if (needsUpdate) {
			fetchPosts();
		}
	}, [needsUpdate]);

	const update = () => {
		setNeedsUpdate(true);
	};

	useEffect(() => {
		console.log(currentUserPosts);
	}, [id]);

	return (
		<div>
			{user !== null && currentUser !== null && allUsers.length !== 0 && (
				<div className="user-details-page">
					<div className="user-details-container">
						<Navbar first_name={user.first_name} users={allUsers} />
						<div className="details-container-top">
							{currentUser.profile_picture_url !== undefined && (
								<Avatar
									alt={currentUser.first_name + " " + currentUser.last_name}
									src={currentUser.profile_picture_url}
									sx={styles.avatar}
								></Avatar>
							)}

							{user.profile_picture_url === undefined && (
								<Avatar
									alt={currentUser.first_name + " " + currentUser.last_name}
									sx={styles.avatar}
								>
									{currentUser.first_name[0]}
								</Avatar>
							)}

							<div className="name-container">
								{currentUser.first_name + " " + currentUser.last_name}
							</div>
							<div className="details-divider"></div>
						</div>
					</div>

					<div className="details-container-bottom">
						<div className="friends-container">
							<h3 className="friends-container-header">Friends</h3>
							{allFriends.map((friend) => {
								return (
									<div key={friend._id} className="friends-container__box">
										<Link to={"/user/" + friend._id}>
											{friend.profile_picture_url !== undefined && (
												<Avatar
													className="avatar-box"
													alt={friend.first_name + " " + friend.last_name}
													src={friend.profile_picture_url}
													sx={styles.avatarBox}
													variant="rounded"
												></Avatar>
											)}

											{friend.profile_picture_url === undefined && (
												<Avatar
													className="avatar-box"
													alt={friend.first_name + " " + friend.last_name}
													sx={styles.avatarBox}
													variant="rounded"
												>
													{friend.first_name[0]}
												</Avatar>
											)}
										</Link>
										<div className="user-detail-friend-name">
											{friend.first_name + " " + friend.last_name}
										</div>
									</div>
								);
							})}
						</div>
						<div className="posts-container">
							{currentUserPosts.map((post) => {
								if (post.user.profile_picture_url !== undefined) {
									return (
										<Post
											className="user-details-post"
											details={true}
											key={post._id}
											postId={post._id}
											postUserId={post.user._id}
											name={post.user.first_name + " " + post.user.last_name}
											profileURL={post.user.profile_picture_url}
											date={post.time}
											body={post.body}
											update={update}
										></Post>
									);
								} else {
									return (
										<Post
											className="user-details-post"
											details={true}
											key={post._id}
											postId={post._id}
											postUserId={post.user._id}
											name={post.user.first_name + " " + post.user.last_name}
											date={post.time}
											body={post.body}
											update={update}
										></Post>
									);
								}
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default UserDetail;
