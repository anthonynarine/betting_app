import { Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import AuthProvider from "./context/Auth/AuthContext";
import { GroupDataProvider } from "./context/groupData/GroupDataProvider";
import { EventDataProvider } from "./context/eventData/EventDataProvider";
import { BetDataProvider } from "./context/bet/BetDataProvider";
import UserServiceProvider from "./context/user/UserContext";
import ThemeWrapper from "./theme/ThemeProvider";

import HomePage from "./pages/home/HomePage";
import TestLogin from "./pages/login/test/testLogin";
import LoginPage from "./pages/login/LoginPage";
import GroupPage from "./pages/group/GroupPage";
import Signup from "./pages/signup/SignupPage";
import ProtectedRoute from "./context/Auth/ProtectedRoute";

//Stripe
import StripeChargeComponent from "./stripe/StripeChargeRequest";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useFetchStripeKey from "./stripe/FetchStripeKeyRequest";

function App() {
	const { stripePublicKey } = useFetchStripeKey();
	const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
	console.log(stripePromise);

	return (
		<ThemeWrapper>
			<UserServiceProvider>
				<AuthProvider>
					<GroupDataProvider>
						<EventDataProvider>
							<BetDataProvider>
									<CssBaseline />
									<Routes>
										<Route path="/" element={<HomePage />} />
										<Route path="/group/:groupId" element={<GroupPage />} />
										<Route path="/login" element={<LoginPage />} />
										<Route path="/signup" element={<Signup />} />
										<Route
											path="/testlogin"
											element={
												<ProtectedRoute>
													<TestLogin />
												</ProtectedRoute>
											}
										/>
										<Route
											path="/addfunds"
											element={
												<Elements stripe={stripePromise}>
													<StripeChargeComponent />
												</Elements>
											}
										/>
									</Routes>
							</BetDataProvider>
						</EventDataProvider>
					</GroupDataProvider>
				</AuthProvider>
			</UserServiceProvider>
		</ThemeWrapper>
	);
}

export default App;
