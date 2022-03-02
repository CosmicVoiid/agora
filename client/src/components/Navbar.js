import React, { useEffect } from "react";
import {
	Autocomplete,
	TextField,
	Box,
	InputAdornment,
	IconButton,
	Avatar,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

const styles = {
	autocomplete: {
		"& .MuiInputBase-root": {
			width: "15vw",
		},
		"& .MuiInputBase-input": {
			width: "15vw",
			margin: "auto",
			height: "0rem",
		},
		"& fieldset": {
			borderColor: "#2f3d58 !important",
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

function Navbar(props) {
	return (
		<nav className="navbar">
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
						fill="#D6A37C"
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
				<Avatar>H</Avatar>
			</Box>
		</nav>
	);
}

export default Navbar;
