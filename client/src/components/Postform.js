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
			fetch("https://agora-atlas.herokuapp.com/api/post", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ body }),
			});

			props.update();
		} catch (err) {
			console.log(err);
		}

		setBody("");
	};

	return (
		<div className="postform">
			<form className="post-form" action="" onSubmit={handleSubmit}>
				<StyledAvatar className="postform-avatar" />
				<input
					type="text"
					className="postform__text postform__text-large"
					placeholder={`What's on your mind, ${props.first_name}?`}
					onChange={changeBody}
					value={body}
					required
				/>

				<input
					type="text"
					className="postform__text postform__text-small"
					placeholder={`Hi, ${props.first_name}!`}
					onChange={changeBody}
					value={body}
					required
				/>

				<button className="submit-btn postform-submit-btn" type="submit">
					<FontAwesomeIcon
						icon="fa-solid fa-paper-plane"
						className="icon postform-icon"
					/>
				</button>
			</form>
		</div>
	);
}

export default Postform;
