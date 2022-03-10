import React, { useState } from "react";
import StyledAvatar from "./StyledAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Postform.css";

function Postform(props) {
	const [body, setBody] = useState("");

	const changeBody = (e) => {
		setBody(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="postform">
			<form className="post-form" action="">
				<StyledAvatar />
				<input
					type="text"
					className="postform__text"
					placeholder={`What's on your mind, ${props.first_name}?`}
					onChange={changeBody}
					required
				/>

				<button className="submit-btn" type="submit">
					<FontAwesomeIcon icon="fa-solid fa-paper-plane" />
				</button>
			</form>
		</div>
	);
}

export default Postform;
