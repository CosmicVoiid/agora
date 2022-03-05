import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../UserContext";

function Homepage() {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		//Fetch user from api
		const fetchUser = async (token) => {
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
					navigate("/login");
					return;
				} else {
					setUser(userData);
				}
			} catch (err) {
				navigate("/login");
				return;
			}
		};

		fetchUser();
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
