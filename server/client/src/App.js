import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AllPosts from "./pages/AllPosts";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserContext } from "./UserContext";

function App() {
	const [user, setUser] = useState(null);
	const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");

		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			setUser(foundUser);
		}
	}, []);

	return (
		<BrowserRouter>
			<UserContext.Provider value={providerValue}>
				<Routes>
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/signup" element={<Signup />} />
					<Route exact path="/home" element={<Homepage />} />
					<Route exact path="/users" element={<Users />} />
					<Route exact path="/user/:id" element={<UserDetail />} />
					<Route exact path="/posts" element={<AllPosts />} />
				</Routes>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
