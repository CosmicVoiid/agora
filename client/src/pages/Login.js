import { React, useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const changeEmail = (e) => {
		setEmail(e.target.value);
	};

	const changePassword = (e) => {
		setPassword(e.target.value);
	};

	const authenticate = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			// const userData = await response.json();
			if (response.status !== 200) {
				const userData = await response.json();
				setErrorMessage(userData.info);
			} else {
				// console.log(userData);
				// localStorage.setItem("agora_token", JSON.stringify(userData.token));
				console.log("successfully logged in");
				setLoggedIn(true);
			}
		} catch (err) {
			console.log(err);
			alert(err);
		}
	};

	const googleAuthenticate = async () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};

	useEffect(() => {
		console.log(errorMessage);
	}, [errorMessage]);

	// useEffect(() => {
	// 	console.log(localStorage.getItem("agora_token"));
	// 	if (localStorage.getItem("agora_token") !== null) {
	// 		const getUser = async (token) => {
	// 			try {
	// 				const response = await fetch("http://localhost:5000/user", {
	// 					method: "GET",
	// 					mode: "cors",
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 						Authorization: `Bearer ${token}`,
	// 					},
	// 					credentials: "include",
	// 				});

	// 				const userData = await response.json();
	// 				console.log(userData);
	// 				if (userData.success) {
	// 					navigate("/home");
	// 					return;
	// 				}
	// 			} catch (err) {
	// 				console.log(err);
	// 			}
	// 		};

	// 		const bearerToken = localStorage
	// 			.getItem("agora_token")
	// 			.replace(/['"]+/g, "");

	// 		getUser(bearerToken);
	// 	}
	// }, [user]);

	useEffect(() => {
		const getUser = async () => {
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
				console.log(userData);
				if (userData.success) {
					setUser(userData);
					navigate("/home");
					return;
				}
			} catch (err) {
				setLoggedIn(false);
			}
		};

		if (loggedIn) {
			getUser();
		}
	}, [loggedIn, setUser]);

	return (
		<div className="login-container">
			<div className="login-container__details">
				<h1 className="main-header">Agora</h1>
				<h2 className="secondary-header">Log In</h2>
				<form className="login-form" action="">
					<input
						type="text"
						name="email"
						placeholder="Email"
						value={email}
						onChange={changeEmail}
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={changePassword}
						required
					/>
					<button className="btn" type="submit" onClick={authenticate}>
						Log In
					</button>
				</form>
				<button className="btn" onClick={googleAuthenticate}>
					Sign in with Google
				</button>
				<p className="signup-link">
					Don't have an account? <Link to="/signup">Register</Link>
				</p>
				<ul className="error-text">
					{errorMessage !== "" && <li>{errorMessage}</li>}
				</ul>
			</div>
		</div>
	);
}

export default Login;
