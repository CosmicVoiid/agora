import React, { useContext, useState } from "react";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Postmodal from "./Postmodal";
import "./Comment.css";

const styles = {
	avatar: {
		border: "1px solid #d6a37c",
		color: "#d6a37c",
		backgroundColor: "#2f3d58",
		margin: "0 5px",
		transition: "filter 300ms",
		width: "2.1rem",
		height: "2.1rem",
		":hover": {
			cursor: "pointer",
			filter: "brightness(1.2)",
		},
	},
};

function Comment(props) {
	const { user } = useContext(UserContext);
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
		<div className="comment-container">
			<Link to={"/user/" + props.user._id}>
				{props.user.profile_picture_url !== undefined && (
					<Avatar
						alt={props.user.first_name + " " + props.user.last_name}
						src={props.user.profile_picture_url}
						sx={styles.avatar}
					></Avatar>
				)}

				{props.user.profile_picture_url === undefined && (
					<Avatar
						alt={props.user.first_name + " " + props.user.last_name}
						sx={styles.avatar}
					>
						{props.user.first_name[0]}
					</Avatar>
				)}
			</Link>

			<div className="comment-box">
				<div className="comment-box__content">
					<p className="comment-name">
						{props.user.first_name + " " + props.user.last_name}
					</p>
					<p className="comment">{props.comment}</p>
				</div>
				{user._id === props.user._id && (
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
											onClick={() => toggleModal(["Edit", props.comment])}
										>
											<FontAwesomeIcon
												icon="fa-solid fa-pen-to-square"
												className="icon"
											/>
											<div>Update</div>
										</li>
										<li
											className="post-dropdown__list-item"
											onClick={() => toggleModal(["Delete", props.comment])}
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
				)}
			</div>

			{useModal && (
				<Postmodal
					crud={modalType[0]}
					toggle={toggleModal}
					body={modalType[1]}
					postId={props.postId}
					update={props.update}
					isComment={true}
					commentId={props.commentId}
					updateComment={props.updateComment}
				></Postmodal>
			)}
		</div>
	);
}

export default Comment;
