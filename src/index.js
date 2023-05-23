// External imports
import { createStore, StoreProvider } from "easy-peasy";
import React from "react";
import ReactDOM from "react-dom";

// Internal imports
import { firebase } from "./components/firebase/firebase";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import firebaseModel from "./models/firebase";
import groceriesModel from "./models/groceries";
import initialiser from "./models/initialiser";
import recipesModel from "./models/recipes/recipes";
import weeksModel from "./models/weeks";
import newWeeksModel from "./models/weeks/newWeeks";
import AppRouter, { history } from "./routers/AppRouter";
import "./styles/styles.scss";

const store = createStore({
    auth: firebaseModel,
    recipes: recipesModel,
    weeks: weeksModel,
    newWeeks: newWeeksModel,
    groceries: groceriesModel,
    init: initialiser,
});

const jsx = (
    <StoreProvider store={store}>
        <AppRouter />
    </StoreProvider>
);

let hasRendered = false;
const renderApp = () => {
    if (!hasRendered) {
        ReactDOM.render(jsx, document.getElementById("root"));
        hasRendered = true;
    }
};
ReactDOM.render(<LoadingPage />, document.getElementById("root"));

firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        store.dispatch.auth.login(user.uid);
        store.dispatch.init.initialiseUser({ history, renderApp });
    } else {
        store.dispatch.auth.logout();
        renderApp();
        history.push("/");
    }
});

export { store };
