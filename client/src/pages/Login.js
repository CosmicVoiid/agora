import { React, useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Login.css";

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
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			const userData = await response.json();
			if (!userData.user) {
				setErrorMessage(userData.info);
			} else {
				console.log(userData);
				localStorage.setItem("token", JSON.stringify(userData.token));
				setUser(userData);
			}
		} catch (err) {
			alert(err);
		}
	};

	const googleAuthenticate = async () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};

	useEffect(() => {
		console.log(errorMessage);
	}, [errorMessage]);

	useEffect(() => {
		if (user !== null) {
			navigate("/home");
		}
	}, [user, navigate]);

	useEffect(() => {
		const isGoogleAuth = async () => {
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
					console.log(userData);
					localStorage.setItem("token", JSON.stringify(userData.token));
					setUser(userData);
				}
			} catch (err) {
				return;
			}
		};
		isGoogleAuth();
	}, []);

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
