import { React, useState, useEffect } from "react";
import "./Login.css";

function Login() {
	return (
		<div className="login-container">
			<div className="login-container__details">
				<h1 className="main-header">Agora</h1>
				<h2 className="secondary-header">Login</h2>
				<form className="login-form">
					<input type="text" name="email" placeholder="Email" />
					<input type="text" name="password" placeholder="Password" />
					<button className="btn" type="submit">
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
