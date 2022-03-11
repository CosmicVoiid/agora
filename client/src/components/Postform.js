import React, { useState } from "react";
import StyledAvatar from "./StyledAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Postform.css";

function Postform(props) {
	const [body, setBody] = useState("");

	const changeBody = (e) => {
		setBody(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			fetch("http://localhost:5000/post", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ body }),
			});
		} catch (err) {
			console.log(err);
		}

		setBody("");
	};

	return (
		<div className="postform">
			<form className="post-form" action="" onSubmit={handleSubmit}>
				<StyledAvatar />
				<input
					type="text"
					className="postform__text"
					placeholder={`What's on your mind, ${props.first_name}?`}
					onChange={changeBody}
					value={body}
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
