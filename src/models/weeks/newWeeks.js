// External imports
import { action, thunk, thunkOn } from "easy-peasy";
import moment from "moment";

// Internal imports
import database from "../../components/firebase/firebase";
import { store } from "../../index";
import { weekStructure } from "../../utils/structure";
import { orderByDays } from "./utils";

const newWeeksModel = {
    yearWeeks: [],
    years: [],
    week: {
        groceries: {},
    },
    startWeekListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        const curWeek = store.getState().newWeeks.week;
        if (curWeek !== null) {
            actions.stopWeekListener();
        } else if (curWeek !== null && curWeek.weekid !== payload.weekid) {
            actions.stopWeekListener();
        }
        var weekid = payload.weekid && payload.weekid;

        const currentYear = moment().year();
        const currentWeekNr = moment().isoWeek();

        switch (payload.type) {
            case "CURRENT_WEEK":
                var currentWeek = await database
                    .ref(
                        `users/${uid}/yearWeeks/${currentYear}/${currentWeekNr}`
                    )
                    .once("value");

                if (currentWeek.val() !== null) {
                    weekid = currentWeek.val();
                } else {
                    actions.newWeek({
                        year: currentYear,
                        weekNr: currentWeekNr,
                    });
                    return;
                }

                break;
            case "NEXT_WEEK":
                var nextWeekYear = payload.year;
                var nextWeekNr = payload.weekNr + 1;

                if (payload.weekNr === moment().isoWeeksInYear(nextWeekYear)) {
                    nextWeekYear = payload.year + 1;
                    nextWeekNr = 1;
                }

                var nextWeek = await database
                    .ref(
                        `users/${uid}/yearWeekNumbers/${nextWeekYear}_${nextWeekNr}`
                    )
                    .once("value");
                if (nextWeek.val() !== null) {
                    weekid = nextWeek.val();
                } else {
                    actions.newWeek({
                        year: nextWeekYear,
                        weekNr: nextWeekNr,
                    });
                    return;
                }
                break;
            case "SPECIFIC_WEEK":
                var specificWeek = await database
                    .ref(
                        `users/${uid}/yearWeeks/${payload.year}/${payload.weekNr}`
                    )
                    .once("value");
                if (specificWeek.val() !== null) {
                    weekid = specificWeek.val();
                } else {
                    actions.newWeek({
                        year: payload.year,
                        weekNr: payload.weekNr,
                    });
                    return;
                }
                break;
            case "PREVIOUS_WEEK":
                var prevWeekYear = payload.year;
                var prevWeekNr = payload.weekNr - 1;
                if (payload.weekNr === 1) {
                    prevWeekYear = payload.year - 1;
                    prevWeekNr = moment().isoWeeksInYear(prevWeekYear);
                }
                var prevWeek = await database
                    .ref(
                        `users/${uid}/yearWeekNumbers/${prevWeekYear}_${prevWeekNr}`
                    )
                    .once("value");
                if (prevWeek.val() !== null) {
                    weekid = prevWeek.val();
                } else {
                    actions.newWeek({
                        year: prevWeekYear,
                        weekNr: prevWeekNr,
                    });
                    return;
                }
                break;
            default:
                if (curWeek === null) {
                    var presentWeek = await database
                        .ref(
                            `users/${uid}/yearWeeks/${currentYear}/${currentWeekNr}`
                        )
                        .once("value");

                    if (presentWeek.val() !== null) {
                        weekid = presentWeek.val();
                    } else {
                        actions.newWeek({
                            year: currentYear,
                            weekNr: currentWeekNr,
                        });
                        return;
                    }
                } else {
                    weekid = payload.weekid;
                }
        }

        var weekRef = database.ref(`users/${uid}/weeks/${weekid}`);
        weekRef.on("value", function (snapshot) {
            var weekObj = snapshot.val();
            weekObj["weekid"] = snapshot.key;
            sessionStorage.setItem("weekid", snapshot.key);
            actions.populateWeekRecipes(weekObj);
            actions.setYearWeeks({
                weeks: moment().isoWeeksInYear(weekObj.year),
            });
        });
    }),
    stopWeekListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        await database.ref(`users/${uid}/weeks/`).off();
    }),
    populateWeekRecipes: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        var recipeArr = [];
        for (let [key, value] of Object.entries(payload.recipes)) {
            if (value.recipeid !== "") {
                var recipe = await database
                    .ref(`users/${uid}/recipes/${value.recipeid}`)
                    .once("value");

                if (recipe.val() === null) {
                    recipeArr.push({ day: key, recipe: "", recipeid: "" });
                } else {
                    recipeArr.push({
                        recipeid: value.recipeid,
                        recipe: recipe.val(),
                        day: key,
                    });
                }
            } else {
                recipeArr.push({ day: key, recipe: "", recipeid: "" });
            }
        }
        payload.recipes = recipeArr;
        actions.setWeek({ type: "ALL", ...payload });
    }),
    onSetWeek: thunkOn(
        (actions) => actions.setWeek,

        async (actions, target) => {
            const uid = store.getState().auth.uid;
            const weekid = sessionStorage.getItem("weekid");

            if (target.payload.type === "UPDATE_GROCERY_PRODUCT") {
                await database
                    .ref(
                        `users/${uid}/weeks/${weekid}/groceries/${target.payload.groceryid}/product`
                    )
                    .set(target.payload.product);
            } else if (target.payload.type === "UPDATE_GROCERY_AMOUNT") {
                await database
                    .ref(
                        `users/${uid}/weeks/${weekid}/groceries/${target.payload.groceryid}/amount`
                    )
                    .set(target.payload.amount);
            } else if (target.payload.type === "NEW_GROCERY") {
                await database
                    .ref(
                        `users/${uid}/weeks/${weekid}/groceries/${target.payload.groceryid}`
                    )
                    .set({
                        amount: target.payload.amount,
                        product: target.payload.product,
                    });
            } else if (target.payload.type === "NEW_GROCERY_SLOT") {
                await database
                    .ref(
                        `users/${uid}/weeks/${weekid}/groceries/${target.payload.groceryid}`
                    )
                    .set({ amount: "", product: "" });
            }
        }
    ),
    setWeek: action((state, payload) => {
        switch (payload.type) {
            case "ALL":
                const recipes = orderByDays(payload.recipes);
                payload["recipes"] = recipes;
                state.week = payload;
                break;
            case "NEW_GROCERY_SLOT":
                state.week.groceries[payload.groceryid] = {
                    product: "",
                    amount: "",
                };
                break;
            case "NEW_GROCERY":
                state.week.groceries[payload.groceryid] = {
                    product: payload.product,
                    amount: payload.amount,
                };
                break;
            case "UPDATE_GROCERY_AMOUNT":
                state.week.groceries[payload.groceryid]["amount"] =
                    payload.amount;
                break;
            case "UPDATE_GROCERY_PRODUCT":
                state.week.groceries[payload.groceryid]["product"] =
                    payload.product;
                break;
            default:
                break;
        }
    }),
    updateWeek: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;

        switch (payload.type) {
            case "TOTAL_UPDATE":
                await database
                    .ref(`users/${uid}/weeks/${payload.weekid}`)
                    .update({ total: payload.total });
                break;
            case "RECIPE_UPDATE":
                await database
                    .ref(
                        `users/${uid}/weeks/${payload.weekid}/recipes/${payload.day}`
                    )
                    .update({
                        recipeName: payload.recipeName,
                        recipeid: payload.recipeid,
                    });
                break;
            case "RECIPE_REMOVE":
                await database
                    .ref(
                        `users/${uid}/weeks/${payload.weekid}/recipes/${payload.day}`
                    )
                    .update({ recipeName: "", recipeid: "" });
                break;
            default:
                break;
        }
    }),
    newWeek: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        const localWeekStructure = weekStructure();
        const newWeekid = await database.ref(`users/${uid}/weeks`).push({
            ...localWeekStructure,
            weekNr: payload.weekNr,
            year: payload.year,
            year_weekNr: `${payload.year}_${payload.weekNr}`,
        }).key;

        var updates = {};
        updates[
            `users/${uid}/yearWeekNumbers/${payload.year}_${payload.weekNr}`
        ] = newWeekid;
        updates[`users/${uid}/yearWeeks/${payload.year}/${payload.weekNr}`] =
            newWeekid;
        updates[`users/${uid}/years/${payload.year}`] = true;

        await database.ref().update(updates, function (error) {
            actions.startWeekListener({
                type: "SPECIFIC_WEEK",
                year: payload.year,
                weekNr: payload.weekNr,
            });
        });
    }),
    startYearListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;

        var yearRef = database.ref(`users/${uid}/years`);
        yearRef.on("value", function (snapshot) {
            var years = snapshot.val();
            var parsedYears = Object.keys(years)
                .map((year) => parseInt(year))
                .sort((a, b) => b - a);
            actions.setYears(parsedYears);
        });
    }),
    stopYearListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        await database.ref(`users/${uid}/years`).off();
        actions.setYears([]);
    }),
    startYearWeekListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        var year = payload.year ? payload.year : "";

        switch (payload.type) {
            case "LATEST_YEAR":
                const latestYear = await database
                    .ref(`users/${uid}/years`)
                    .orderByKey()
                    .limitToLast(1)
                    .once("value");
                year = Object.keys(latestYear.val())[0];
                break;
            default:
                break;
        }

        var yearWeekRef = database.ref(`users/${uid}/yearWeeks/${year}`);
        yearWeekRef.on("value", function (snapshot) {
            var yearWeeks = snapshot.val();
            var parsedYearWeeks = Object.keys(yearWeeks)
                .map((yearWeek) => parseInt(yearWeek))
                .sort((a, b) => b - a);
            actions.setYearWeeks(parsedYearWeeks);
        });
    }),
    stopYearWeekListener: thunk(async (actions, payload) => {
        const uid = store.getState().auth.uid;
        await database.ref(`users/${uid}/yearWeeks`).off();
        actions.setYearWeeks([]);
    }),
    setYearWeeks: action((state, payload) => {
        if (payload.weeks && payload.weeks.length !== 0) {
            var weeksArr = [];
            for (var i = 1; i < payload.weeks + 1; i++) {
                weeksArr.push(i);
            }
            state.yearWeeks = weeksArr;
        }
    }),
    setYears: action((state, payload) => {
        state.years = payload;
    }),
};

export default newWeeksModel;
