import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import StyledAvatar from "./StyledAvatar";
import Postmodal from "./Postmodal";
import Comment from "./Comment";
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
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [userRating, setUserRating] = useState("N/A");
	const [comments, setComments] = useState([]);
	const [commentText, setCommentText] = useState("");
	const [updateComments, setUpdateComments] = useState(true);

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

	const likePost = () => {
		if (
			userRating === "N/A" ||
			userRating === "" ||
			userRating === "Disliked"
		) {
			try {
				console.log(`id: ${props.postId}`);
				fetch(`http://localhost:5000/post/${props.postId}/rating`, {
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ rating: "Liked" }),
				});

				if (userRating === "Disliked") {
					setDislikes(dislikes - 1);
				}

				setUserRating("Liked");
				setLikes(likes + 1);
			} catch (err) {
				console.log(err);
			}
		} else if (userRating === "Liked") {
			try {
				console.log(`id: ${props.postId}`);
				fetch(`http://localhost:5000/post/${props.postId}/rating`, {
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ rating: "N/A" }),
				});

				setUserRating("N/A");
				setLikes(likes - 1);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const dislikePost = () => {
		if (userRating === "N/A" || userRating === "" || userRating === "Liked") {
			try {
				fetch(`http://localhost:5000/post/${props.postId}/rating`, {
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ rating: "Disliked" }),
				});

				if (userRating === "Liked") {
					setLikes(likes - 1);
				}

				setUserRating("Disliked");
				setDislikes(dislikes + 1);
			} catch (err) {
				console.log(err);
			}
		} else if (userRating === "Disliked") {
			try {
				fetch(`http://localhost:5000/post/${props.postId}/rating`, {
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ rating: "N/A" }),
				});

				setUserRating("N/A");
				setDislikes(dislikes - 1);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const handleCommentText = (e) => {
		setCommentText(e.target.value);
	};

	const handleSubmitComment = (e) => {
		e.preventDefault();
		try {
			fetch(`http://localhost:5000/post/${props.postId}/comments`, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ body: commentText }),
			}).then(() => {
				handleUpdateComments();
			});
		} catch (err) {
			console.log(err);
		}

		setCommentText("");
	};

	const handleUpdateComments = () => {
		setUpdateComments(true);
	};

	useEffect(() => {
		const getRatings = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/post/${props.postId}/rating`,
					{
						method: "GET",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					}
				);

				const data = await response.json();

				if (data.success) {
					setLikes(data.likes);
					setDislikes(data.dislikes);
					setUserRating(data.userRating);
				}
			} catch (err) {
				console.log(err);
			}
		};

		getRatings();
	}, []);

	useEffect(() => {
		if (updateComments) {
			const getComments = async () => {
				try {
					const response = await fetch(
						`http://localhost:5000/post/${props.postId}/comments`,
						{
							method: "GET",
							mode: "cors",
							headers: {
								"Content-Type": "application/json",
							},
							credentials: "include",
						}
					);

					const data = await response.json();

					if (data.success) {
						setComments(data.comments);
					}
				} catch (err) {
					console.log(err);
				}
			};

			getComments();
			setUpdateComments(false);
		}
	}, [updateComments]);

	useEffect(() => {
		console.log("this is a comment");
		console.log(comments);
	}, [comments]);

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
										onClick={() => toggleModal(["Delete", props.body])}
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
			<div className="post-divider"></div>
			<div className="thumbs">
				<FontAwesomeIcon
					icon="fa-solid fa-thumbs-up"
					className={"icon " + (userRating === "Liked" && "selected")}
					onClick={likePost}
				/>

				{likes !== 0 && <p className="rating-number-likes">{likes}</p>}

				<FontAwesomeIcon
					icon="fa-solid fa-thumbs-down"
					className={"icon " + (userRating === "Disliked" && "selected")}
					onClick={dislikePost}
				/>

				{dislikes !== 0 && <p className="rating-number-dislikes">{dislikes}</p>}
			</div>
			<div className="post-divider"></div>
			{comments.length !== 0 &&
				comments.map((comment) => {
					return (
						<Comment
							key={comment._id}
							commentId={comment._id}
							user={comment.user}
							comment={comment.body}
							postId={props.postId}
							updateComment={handleUpdateComments}
						/>
					);
				})}

			<form className="comment-form" action="" onSubmit={handleSubmitComment}>
				<StyledAvatar className="comment-avatar" />
				<input
					type="text"
					className="comment-input"
					placeholder="Say something..."
					value={commentText}
					onChange={handleCommentText}
				/>
				<button type="submit" className="submit-btn">
					<FontAwesomeIcon
						icon="fa-solid fa-paper-plane"
						className="icon submit-icon"
					/>
				</button>
			</form>

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
