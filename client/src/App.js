import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
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
				</Routes>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
