import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "../components/Navbar";
import Postform from "../components/Postform";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import SidebarFriends from "../components/SidebarFriends";
import "./Homepage.css";

function Homepage() {
	const { user, setUser } = useContext(UserContext);
	const [allUsers, setAllUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [needsUpdate, setNeedsUpdate] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		//Fetch user from api
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
					const id = userData.user._id;
					fetchPosts(id);
				}
			} catch (err) {
				navigate("/login");
				return;
			}
		};

		const fetchPosts = async (id) => {
			try {
				const response = await fetch(`http://localhost:5000/post/${id}`, {
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
					setPosts(postsData.results);
					fetchUsers();
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

		fetchUser();
	}, []);

	useEffect(() => {
		if (needsUpdate) {
			const fetchPosts = async () => {
				try {
					const response = await fetch("http://localhost:5000/post", {
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
						setPosts(postsData.results);
					}
				} catch (err) {
					console.log(err);
				}
			};

			fetchPosts();
			setNeedsUpdate(false);
		}
	}, [needsUpdate]);

	const update = () => {
		setNeedsUpdate(true);
	};

	return (
		<div>
			{user !== null && (
				<div>
					<div className="homepage">
						<Navbar first_name={user.first_name} users={allUsers} />
						<Sidebar defaultSelection="Feed" />
						<div className="homepage-body-container">
							<Postform first_name={user.first_name} update={update} />

							{posts.map((post) => {
								if (post.user.profile_picture_url !== undefined) {
									return (
										<Post
											key={post._id}
											postId={post._id}
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
											key={post._id}
											postId={post._id}
											name={post.user.first_name + " " + post.user.last_name}
											date={post.time}
											body={post.body}
											update={update}
										></Post>
									);
								}
							})}
						</div>
						<SidebarFriends />
					</div>
				</div>
			)}
		</div>
	);
}

export default Homepage;
