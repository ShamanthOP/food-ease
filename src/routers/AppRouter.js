// External imports
import { createBrowserHistory } from "history";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Internal imports
import { useStoreState } from "easy-peasy";
import LoginPage from "../components/LoginPage/LoginPage";
import MainDashboard from "../components/MainDashboard/MainDashboard";
import ManageRecipes from "../components/ManageRecipes/ManageRecipes";
import NavBar from "../components/NavBar/NavBar";
import SignUp from "../components/SignUp/SignUp";
import RecipeEdit from "../components/RecipeEdit/RecipeEdit";
import NotFound from "../components/NotFound/NotFound";
import RecipePicker from "../components/RecipePicker/RecipePicker";
import NewRecipe from "../components/NewRecipe/NewRecipe";
import OrderedGroceries from "../components/OrderedGroceries/OrderedGroceries";
export const history = createBrowserHistory();

const AppRouter = () => {
    const uid = useStoreState((state) => state.auth.uid);
    const isAuthenticated = !!uid;

    return (
        <BrowserRouter history={history}>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <MainDashboard />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                    exact={true}
                />
                <Route
                    path="/sign-up"
                    element={isAuthenticated ? <MainDashboard /> : <SignUp />}
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <MainDashboard />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/dashboard/:weekid?"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <MainDashboard />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/manage-recipes/:weekid"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <ManageRecipes />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/edit/:id/:weekid"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <RecipeEdit />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/recipe-picker/:weekid/:day"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <RecipePicker />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/new-recipe/:weekid"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <NewRecipe />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path="/ordered-groceries/:weekid"
                    element={
                        isAuthenticated ? (
                            <div>
                                <NavBar />
                                <OrderedGroceries />
                            </div>
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
