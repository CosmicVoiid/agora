import React, { useContext } from "react";
import { UserContext } from "../UserContext";

function Homepage() {
	const { user, setUser } = useContext(UserContext);

	return (
		<div>
			<h1>HomePage</h1>
			<pre>{JSON.stringify(user)}</pre>
		</div>
	);
}

export default Homepage;
