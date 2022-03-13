import React, { useState } from "react";
import { Avatar } from "@mui/material";
import Postmodal from "./Postmodal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Post.css";

const styles = {
	avatar: {
		border: "1px solid #d6a37c",
		color: "#d6a37c",
		backgroundColor: "#2f3d58",
		margin: "0 5px",
		transition: "filter 300ms",
		":hover": {
			cursor: "pointer",
			filter: "brightness(1.2)",
		},
	},
};

const options = { year: "numeric", month: "long", day: "numeric" };

function Post(props) {
	const [dropdown, setDropdown] = useState(false);
	const [useModal, setUseModal] = useState(false);
	const [modalType, setModalType] = useState([]);

	const toggleDropdown = () => {
		dropdown ? setDropdown(false) : setDropdown(true);
	};

	const closeDropdown = () => {
		setDropdown(false);
	};

	const toggleModal = (crud) => {
		if (useModal) {
			setModalType(["", ""]);
			setUseModal(false);
		} else {
			setDropdown(false);
			setModalType(crud);
			setUseModal(true);
		}
	};

	return (
		<div className="post-container">
			<div className="post-container__header">
				<div className="header-left">
					{props.profileURL !== undefined && (
						<Avatar
							sx={styles.avatar}
							alt={props.name}
							src={props.profileURL}
						></Avatar>
					)}
					{props.profileURL === undefined && (
						<Avatar sx={styles.avatar} alt={props.name}>
							{props.name[0]}
						</Avatar>
					)}
					<div className="header-info">
						<h3>{props.name}</h3>
						<p>{new Date(props.date).toLocaleDateString(undefined, options)}</p>
					</div>
				</div>
				<div className="header-right">
					<div
						className="post-dropdown-container"
						tabIndex={0}
						autoFocus
						onBlur={closeDropdown}
					>
						<FontAwesomeIcon
							icon="fa-solid fa-ellipsis"
							onClick={toggleDropdown}
							className="icon"
						/>
						{dropdown && (
							<div className="post-dropdown">
								<ul className="post-dropdown__list">
									<li
										className="post-dropdown__list-item"
										onClick={() => toggleModal(["Edit", props.body])}
									>
										<FontAwesomeIcon
											icon="fa-solid fa-pen-to-square"
											className="icon"
										/>
										<div>Update</div>
									</li>
									<li
										className="post-dropdown__list-item"
										onClick={() => toggleModal(["Delete", ""])}
									>
										<FontAwesomeIcon
											icon="fa-solid fa-trash-can"
											className="icon"
										/>
										<div>Delete</div>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="post-container__body">{props.body}</div>

			{useModal && (
				<Postmodal
					crud={modalType[0]}
					toggle={toggleModal}
					body={modalType[1]}
					postId={props.postId}
					update={props.update}
				></Postmodal>
			)}
		</div>
	);
}

export default Post;
