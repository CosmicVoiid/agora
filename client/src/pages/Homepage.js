import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../UserContext";

function Homepage() {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		const getUser = async () => {
			//Check if Google Authenticated
			try {
				const response = await fetch("http://localhost:5000/login/success", {
					method: "GET",
					credentials: "include",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const userData = await response.json();
				console.log(userData);
				if (!userData.user) {
					console.log(userData.message);
				} else {
					console.log(`Google auth token: ${userData.token}`);
					localStorage.setItem("agora_token", JSON.stringify(userData.token));
					setUser(userData);
				}
			} catch (err) {
				return;
			}

			//Check if there is a jwt token
			if (localStorage.getItem("agora_token") !== null) {
				const bearerToken = localStorage
					.getItem("agora_token")
					.replace(/['"]+/g, "");
				fetchUser(bearerToken);
			} else {
				navigate("/login");
				return;
			}
		};

		//Fetch user from api
		const fetchUser = async (token) => {
			console.log(`this is the token ${token}`);
			try {
				const response = await fetch("http://localhost:5000/user", {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
				});

				const userData = await response.json();
				console.log(`get user user data ${JSON.stringify(userData)}`);
				if (userData.success === false) {
					navigate("/login");
					return;
				} else {
					console.log(userData);
					setUser(userData);
				}
			} catch (err) {
				console.log(err);
				navigate("/login");
				return;
			}
		};

		getUser();
	}, []);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<div>
			<Navbar options={["Yo", "hey"]} />
			<h1>HomePage</h1>
			<pre>{JSON.stringify(user)}</pre>
		</div>
	);
}

export default Homepage;
