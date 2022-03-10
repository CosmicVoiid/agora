import { React, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Signup.css";

function Signup() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [errorMessage, setErrorMessage] = useState([]);
	const [inputError, setInputError] = useState([]);
	const [formSuccess, setFormSuccess] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const changeFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const changeLastName = (e) => {
		setLastName(e.target.value);
	};

	const changeEmail = (e) => {
		setEmail(e.target.value);
	};

	const changePassword = (e) => {
		setPassword(e.target.value);
	};

	const changePasswordConfirm = (e) => {
		setPasswordConfirm(e.target.value);
	};

	const handleError = (param) => {
		return inputError.indexOf(param) >= 0;
	};

	// const validate = (
	// 	firstVal,
	// 	lastVal,
	// 	emailVal,
	// 	passwordVal,
	// 	passwordConfirmVal
	// ) => {
	// 	return {
	// 		firstName: firstVal.indexOf(" ") >= 0,
	// 		lastName: lastVal.indexOf(" ") >= 0,
	// 		email: emailVal.indexOf(" ") >= 0,
	// 		password: passwordVal.indexOf(" ") >= 0,
	// 		passwordMatch: passwordConfirmVal === passwordVal,
	// 	};
	// };

	const signup = async (e) => {
		e.preventDefault();
		// const errors = validate(
		// 	firstName,
		// 	lastName,
		// 	email,
		// 	password,
		// 	passwordConfirm
		// );
		// let isError = false;
		// const keys = Object.keys(errors);
		// keys.forEach((key) => {
		// 	console.log(errors[key]);
		// 	if (errors[key] === true) {
		// 		isError = true;
		// 	}
		// });
		try {
			const response = await fetch("http://localhost:5000/api/signup", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					email,
					password,
					password_confirm: passwordConfirm,
				}),
			});

			const userData = await response.json();
			if ("errors" in userData) {
				const errorArray = [];
				const inputArray = [];
				userData.errors.forEach((key) => {
					errorArray.push(key.msg);
					inputArray.push(key.param);
				});
				setErrorMessage(errorArray);
				setInputError(inputArray);
			} else {
				setErrorMessage([]);
				setInputError([]);
				setFormSuccess(true);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			}
		} catch (err) {
			alert(err);
		}
	};

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

	return (
		<div className="signup-container">
			<div className="signup-container__details">
				<h1 className="main-header">Agora</h1>
				<h2 className="secondary-header">Sign Up</h2>
				<form className="signup-form" action="" onSubmit={signup}>
					<input
						type="text"
						name="first_name"
						placeholder="First Name"
						value={firstName}
						onChange={changeFirstName}
						className={handleError("first_name") === true ? "error" : ""}
						required
					/>
					<input
						type="text"
						name="last_name"
						placeholder="Last Name"
						value={lastName}
						onChange={changeLastName}
						className={handleError("last_name") === true ? "error" : ""}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={changeEmail}
						className={handleError("email") === true ? "error" : ""}
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={changePassword}
						className={handleError("password") === true ? "error" : ""}
						required
					/>
					<input
						type="password"
						name="password_confirm"
						placeholder="Confirm Password"
						value={passwordConfirm}
						onChange={changePasswordConfirm}
						className={handleError("password_confirm") === true ? "error" : ""}
						required
					/>
					<button className="btn" type="submit">
						Sign Up
					</button>
					<p className="login-link">
						Already have an account? <Link to="/login">Login</Link>
					</p>
				</form>
				<ul className="error-list">
					{errorMessage.map((message) => (
						<li className="error-list__item">{message}</li>
					))}
				</ul>
				{formSuccess && (
					<h2 className="success-msg">Account successfully created</h2>
				)}
			</div>
		</div>
	);
}

export default Signup;
