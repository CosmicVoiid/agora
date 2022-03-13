import React, { useState } from "react";
import "./Postmodal.css";

function Postmodal(props) {
	const [body, setBody] = useState(props.body);

	const changeBody = (e) => {
		setBody(e.target.value);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:5000/post/${props.postId}`,
				{
					method: "PUT",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ body }),
				}
			);

			const postData = await response.json();
			if (!postData.success) {
				console.log(postData);
			}
		} catch (err) {
			console.log(err);
		}

		props.toggle();
		props.update();
	};

	const handleDeleteSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:5000/post/${props.postId}`,
				{
					method: "DELETE",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const postData = await response.json();
			if (!postData.success) {
				console.log(postData);
			}
		} catch (err) {
			console.log(err);
		}

		props.toggle();
		props.update();
	};

	return (
		<div className="post-modal">
			<div className="post-modal__container">
				<h2 className="post-modal__header">{props.crud}</h2>

				<div className="divider"></div>
				{props.crud !== "Delete" && (
					<form className="modal-form" action="" onSubmit={handleEditSubmit}>
						<label htmlFor="text-area"></label>
						<textarea
							className="modal-textarea"
							name="text-area"
							id="text-area"
							onChange={changeBody}
							value={body}
						/>
						<button className="form-btn icon" type="submit">
							Submit
						</button>
					</form>
				)}

				{props.crud === "Delete" && (
					<form className="modal-form" action="" onSubmit={handleDeleteSubmit}>
						<textarea
							className="modal-textarea"
							name="text-area"
							id="text-area"
							disabled
							value={body}
						/>
						<button className="form-btn icon" type="submit">
							Delete
						</button>
					</form>
				)}
			</div>
			<div className="post-modal__backdrop" onClick={props.toggle}></div>
		</div>
	);
}

export default Postmodal;
