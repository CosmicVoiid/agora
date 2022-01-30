import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

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
				body: JSON.stringify({ email, password }),
			});

			const userData = await response.json();
			if (!userData.user) {
				setErrorMessage(userData.info);
			} else {
			}
		} catch (err) {
			alert(err);
		}
	};

	useEffect(() => {
		console.log(errorMessage);
	}, [errorMessage]);

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
				<p class="signup-link">
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
