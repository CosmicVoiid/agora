import React, { useState, useContext } from "react";
import {
	Autocomplete,
	TextField,
	Box,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledAvatar from "./StyledAvatar";
import "./Navbar.css";

//MUI styles
const styles = {
	autocomplete: {
		"& .MuiInputBase-root": {
			minWidth: "15rem",
			backgroundColor: "white",
			marginLeft: "15px",
		},
		"& .MuiInputBase-input": {
			minWidth: "10rem",
			margin: "auto",
			height: "0rem",
			color: "#2f3d58",
			backgroundColor: "white",
		},
		"& fieldset": {
			borderColor: "#d6a37c !important",
		},
		"& .MuiAutocomplete-clearIndicator": {
			color: "#d6a37c",
		},
		"& .MuiAutocomplete-endAdornment": {
			display: "none !important",
		},
	},
	btn: {
		"& MuiButtonBase-root": {
			backgroundColor: "inherit",
			border: "none",
			padding: "0 !important",
		},
		backgroundColor: "inherit",
		border: "none",
		padding: "0 !important",
	},
};

//React navbar component
function Navbar(props) {
	const { user } = useContext(UserContext);
	const [dropdown, setDropdown] = useState(false);
	const [autoValue, setAutoValue] = useState(null);
	const [clicked, setClicked] = useState(false);
	const navigate = useNavigate();

	const toggleDropdown = () => {
		dropdown ? setDropdown(false) : setDropdown(true);
	};

	const closeDropdown = () => {
		setDropdown(false);
	};

	const handleClick = () => {
		clicked ? setClicked(false) : setClicked(true);
	};

	const logout = () => {
		fetch("https://agora-atlas.herokuapp.com/api/logout", {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then(() => {
				return navigate("/login");
			})
			.catch((err) => {
				alert(err);
			});
	};

	const userDetails = () => {
		return navigate(`/user/${user._id}`);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (autoValue === null) {
			return;
		} else {
			return navigate(`/user/${autoValue.id}`);
		}
	};

	const changeAutoValue = (e, value) => {
		console.log(value);
		setAutoValue(value);
	};

	return (
		<nav className="navbar">
			<div className="nav-container__left">
				<Link to="/home" className="logo">
					<svg
						width="45"
						height="45"
						viewBox="0 0 50 51"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect y="1" width="50" height="50" rx="3" fill="white" />
						<path
							d="M30.3896 18.5854L19.7549 51H11.188L25.7168 11.8984H31.1685L30.3896 18.5854ZM39.2251 51L28.5635 18.5854L27.7041 11.8984H33.2095L47.8188 51H39.2251ZM38.7417 36.4443V42.7554H18.0898V36.4443H38.7417Z"
							fill="#2F3D58"
						/>
					</svg>
				</Link>

				<FontAwesomeIcon
					icon="fa-solid fa-magnifying-glass"
					className="search-icon search-toggle"
					onClick={handleClick}
				/>

				<Box
					component="form"
					className={"navbar__inputs " + (clicked && "navbar__inputs-clicked")}
					onSubmit={handleSubmit}
				>
					<Autocomplete
						sx={styles.autocomplete}
						value={autoValue}
						onChange={(event, value) => changeAutoValue(event, value)}
						options={props.users}
						autoComplete={true}
						className="autocomplete"
						renderInput={(params) => (
							<TextField
								className="textfield"
								{...params}
								placeholder="Find on Agora"
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<InputAdornment position="start">
											<IconButton className="btn-search" type="submit">
												<FontAwesomeIcon
													icon="fa-solid fa-magnifying-glass"
													className="search-icon"
												/>
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						)}
					/>
				</Box>
			</div>

			<div className={"nav-container__right " + (clicked && "none")}>
				<StyledAvatar className="navbar-avatar" />

				<p className="username">{props.first_name}</p>

				<Link to="/home">
					<FontAwesomeIcon icon="fa-solid fa-comment-dots" />
				</Link>

				<div
					className="dropdown-container"
					tabIndex={0}
					autoFocus
					onBlur={closeDropdown}
				>
					<FontAwesomeIcon icon="fa-solid fa-gear" onClick={toggleDropdown} />

					{dropdown && (
						<div className="dropdown-menu">
							<ul>
								<li className="dropdown__list-item" onClick={userDetails}>
									<FontAwesomeIcon icon="fa-solid fa-user" />
									User Settings
								</li>
								<li className="dropdown__list-item" onClick={logout}>
									<FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
									Logout
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
