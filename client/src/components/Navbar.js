import React, { useState, createRef, useEffect } from "react";
import {
	Autocomplete,
	TextField,
	Box,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledAvatar from "./StyledAvatar";
import "./Navbar.css";

//MUI styles
const styles = {
	autocomplete: {
		"& .MuiInputBase-root": {
			width: "15vw",
			backgroundColor: "white",
			marginLeft: "15px",
		},
		"& .MuiInputBase-input": {
			width: "15vw",
			margin: "auto",
			height: "0rem",
			color: "#2f3d58",
			backgroundColor: "white",
		},
		"& fieldset": {
			borderColor: "#d6a37c !important",
		},
		"& 	.MuiAutocomplete-clearIndicator": {
			color: "#d6a37c",
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
	const [dropdown, setDropdown] = useState(false);
	const dropdownRef = createRef();
	const navigate = useNavigate();

	const toggleDropdown = () => {
		dropdown ? setDropdown(false) : setDropdown(true);
	};

	const closeDropdown = () => {
		setDropdown(false);
	};

	const logout = () => {
		fetch("http://localhost:5000/logout", {
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

	useEffect(() => {
		if (dropdown) {
			dropdownRef.current.focus();
		}
	}, [dropdown, dropdownRef]);

	return (
		<nav className="navbar">
			<div className="nav-container__left">
				<div className="logo">
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
				</div>

				<Box className="navbar__inputs">
					<Autocomplete
						sx={styles.autocomplete}
						options={props.options}
						freeSolo={true}
						renderInput={(params) => (
							<TextField
								className="textfield"
								{...params}
								placeholder="Find on Agora"
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<InputAdornment position="start">
											<IconButton className="btn-search">
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

			<div className="nav-container__right">
				<StyledAvatar />

				<p className="username">{props.first_name}</p>

				<FontAwesomeIcon icon="fa-solid fa-comment-dots" />
				<div
					className="dropdown-container"
					tabIndex={0}
					autoFocus
					onBlur={closeDropdown}
					ref={dropdownRef}
				>
					<div className="fa-icon">
						<FontAwesomeIcon icon="fa-solid fa-gear" onClick={toggleDropdown} />
					</div>
					{dropdown && (
						<div className="dropdown-menu">
							<ul>
								<li className="dropdown__list-item">
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
