import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "../components/Navbar";
import Postform from "../components/Postform";
import "./Homepage.css";

function Homepage() {
	const { user, setUser } = useContext(UserContext);
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
					navigate("/login");
					return;
				} else {
					setUser(userData.user);
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
			{user !== null && (
				<div className="homepage">
					<Navbar first_name={user.first_name} options={["Yo", "hey", "HOW"]} />
					<div className="homepage-body-container">
						<Postform first_name={user.first_name} />
					</div>
				</div>
			)}
		</div>
	);
}

export default Homepage;
