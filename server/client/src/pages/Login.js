import { React, useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Login.css";
const google_png = require("../images/btn_google_signin_light_normal_web.png");

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
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
			const response = await fetch(
				"https://agora-atlas.herokuapp.com/api/login",
				{
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ email, password }),
				}
			);

			// const userData = await response.json();
			if (response.status !== 200) {
				const userData = await response.json();
				setErrorMessage(userData.info);
			} else {
				navigate("/home");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const googleAuthenticate = async () => {
		window.open("https://agora-atlas.herokuapp.com/auth/google", "_self");
	};

	useEffect(() => {
		const getUser = async () => {
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
				if (userData.success) {
					setUser(userData);
					navigate("/home");
					return;
				}
			} catch (err) {
				console.log(err);
			}
		};

		getUser();
	}, []);

	useEffect(() => {
		console.log(errorMessage);
	}, [errorMessage]);

	return (
		<div className="login-container">
			<div className="login-container__details">
				<h1 className="main-header">Agora</h1>
				<h2 className="secondary-header">Log In</h2>
				<form className="login-form" action="" onSubmit={authenticate}>
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
					<button className="btn" type="submit">
						Log In
					</button>
				</form>
				<button className="btn-google" onClick={googleAuthenticate}>
					<img
						className="google-img"
						alt="Sign in with Google"
						src={google_png}
					></img>
				</button>
				<p className="signup-link">
					Don't have an account?{" "}
					<Link className="underline" to="/signup">
						Register
					</Link>
				</p>
				<ul className="error-text">
					{errorMessage !== "" && <li>{errorMessage}</li>}
				</ul>
			</div>
		</div>
	);
}

export default Login;
