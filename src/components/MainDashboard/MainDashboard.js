// External imports
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";

// Internal imports
import { addIngredientToGroceries } from "./utils/utils";
import MainDashboardRecipeCard from "../MainDashboardRecipeCard/MainDashboardRecipeCard";
import MainDashboardGroceryTable from "../MainDashboardGroceryTable/MainDashboardGroceryTable";
import MainDashboardNavBar from "../MainDashboardNavBar/MainDashboardNavBar";
import "./main-dashboards.scss";
import LoadingPage from "../LoadingPage/LoadingPage";
import { ReactComponent as Close } from "./utils/close.svg";
import { useParams } from "react-router-dom";

const MainDashboard = (props) => {
    const week = useStoreState(
        (state) => state.newWeeks.week,

        (prev, next) => {
            return false;
        }
    );
    const years = useStoreState((state) => state.newWeeks.years);
    const yearWeeks = useStoreState((state) => state.newWeeks.yearWeeks);

    const startWeekListener = useStoreActions(
        (actions) => actions.newWeeks.startWeekListener
    );
    const stopWeekListener = useStoreActions(
        (actions) => actions.newWeeks.stopWeekListener
    );
    const startYearListener = useStoreActions(
        (actions) => actions.newWeeks.startYearListener
    );
    const stopYearListener = useStoreActions(
        (actions) => actions.newWeeks.stopYearListener
    );
    const startYearWeekListener = useStoreActions(
        (actions) => actions.newWeeks.startYearWeekListener
    );
    const stopYearWeekListener = useStoreActions(
        (actions) => actions.newWeeks.stopYearWeekListener
    );
    const setWeek = useStoreActions((actions) => actions.newWeeks.setWeek);

    const [recipeIngredientToggle, setRecipeIngredientToggle] = useState(false);

    const [cardAnimationName, setCardAnimationName] = useState(false);
    const [animName, setAnimName] = useState("fadeIn");
    const { weekid } = useParams();

    useEffect(() => {
        if (
            weekid === undefined ||
            weekid === "" ||
            weekid === null ||
            weekid === "undefined"
        ) {
            startWeekListener({ type: "CURRENT_WEEK" });
        } else {
            startWeekListener({
                weekid: weekid,
            });
        }
        startYearListener();

        startYearWeekListener({ type: "LATEST_YEAR", year: Math.max(years) });
        return () => {
            // stopWeekListener()
            stopYearListener();
            stopYearWeekListener();
        };
    }, []);

    const handleOnClick = ({ ingredients, name }) => {
        setRecipeIngredientToggle({
            ingredients: Object.keys(ingredients),
            name,
        });
    };

    const handleAddIngredientToGroceries = (data) => {
        addIngredientToGroceries({
            data,
            setWeek,
            week,
        });
    };

    const handleCloseIngredientModal = () => {
        setAnimName("fadeOut");
        setTimeout(() => {
            setRecipeIngredientToggle(false);
            setAnimName("fadeIn");
        }, 300);
    };

    return (
        <div>
            {week.weekNr && years ? (
                <div>
                    <MainDashboardNavBar
                        setRecipeIngredientToggle={setRecipeIngredientToggle}
                        weekNr={week.weekNr}
                        year={week.year}
                        years={years}
                        weeks={yearWeeks}
                        weekTotal={week.total}
                        weekid={week.weekid}
                        setCardAnimationName={setCardAnimationName}
                    />

                    <div id="main-dashboard-content">
                        <div id="main-dashboard-label">Week's recipe list</div>
                        <div className="recipe-list">
                            {week.weekNr
                                ? week.recipes.map((recipe) => {
                                      return (
                                          <MainDashboardRecipeCard
                                              recipe={recipe.recipe}
                                              day={recipe.day}
                                              week={week}
                                              key={recipe.day}
                                              onClick={handleOnClick}
                                              cardAnimationName={
                                                  cardAnimationName
                                              }
                                              setCardAnimationName={
                                                  setCardAnimationName
                                              }
                                          />
                                      );
                                  })
                                : null}
                        </div>

                        <div id="dashboard-grocery-outer-container">
                            {week && (
                                <MainDashboardGroceryTable
                                    weekid={week.weekid}
                                    groceries={week.groceries}
                                    cardAnimationName={cardAnimationName}
                                />
                            )}

                            {recipeIngredientToggle && (
                                <div id="dashboard-grocery-ingredients-container">
                                    <div id="dashboard-grocery-ingredients-title">
                                        Add {recipeIngredientToggle.name}{" "}
                                        ingredients to groceries
                                        <Close
                                            onClick={handleCloseIngredientModal}
                                            id="dashboard-grocery-ingredient-title-close"
                                        />
                                    </div>
                                    <div id="dashboard-grocery-ingredients-inner-container">
                                        {recipeIngredientToggle.ingredients.map(
                                            (ingredient) => {
                                                return (
                                                    <div
                                                        key={ingredient}
                                                        id="dashboard-grocery-ingredient-container"
                                                    >
                                                        <p
                                                            style={{
                                                                animationName:
                                                                    animName,
                                                            }}
                                                            id="dashboard-grocery-ingredient-name"
                                                            onClick={() =>
                                                                handleAddIngredientToGroceries(
                                                                    ingredient
                                                                )
                                                            }
                                                        >
                                                            {ingredient}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div id="main-dashboard-loading">
                    <LoadingPage />
                </div>
            )}
        </div>
    );
};

export default MainDashboard;

// // External imports
// import React, { useEffect, useState } from 'react'
// import { useStoreActions, useStoreState } from 'easy-peasy'

// // Internal imports
// import MainDashboardRecipeCard from '../MainDashboardRecipeCard/MainDashboardRecipeCard'
// import MainDashboardNavBar from '../MainDashboardNavBar/MainDashboardNavBar'
// import GroceryList from '../GroceryList/GroceryList'

// const MainDashboard = () => {
//     const [isLockedButton, setIsLockedButton] = useState('')
//     const [recipeIngredientList, setRecipeIngredientList] = useState([])

//     const previousWeek = useStoreActions(actions => actions.weeks.previousWeek)
//     const nextWeek = useStoreActions(actions => actions.weeks.nextWeek)
//     const populateLatestWeek = useStoreActions(actions => actions.weeks.populateLatestWeek)
//     const startAddWeek = useStoreActions(actions => actions.weeks.startAddWeek)
//     const startAddYear = useStoreActions(actions => actions.weeks.startAddYear)
//     const week = useStoreState(state => state.weeks.week)
//     const weekGroceries = useStoreState(state => state.weeks.week.groceries, (prev, next) => setLocalWeekGroceries(next))
//     const startUpdateWeek = useStoreActions(actions => actions.weeks.startUpdateWeek)
//     const addGrocery = useStoreActions(actions => actions.weeks.addGrocery)
//     const beginFirstWeek = useStoreActions(actions => actions.weeks.beginFirstWeek)

//     const [localWeekGroceries, setLocalWeekGroceries] = useState(weekGroceries)

//     const startBeginFirstWeek = () => {
//         setIsLockedButton('disabled')
//         beginFirstWeek().then(() => {
//             setIsLockedButton('')
//         })
//     }

//     useEffect(() => {
//         if(!week.id) {
//             populateLatestWeek()
//         }
//     }, [])

//     const startAddGrocery = (ingredient) => {
//         const firstFreeGroceryIndex = week.groceries.findIndex((grocery) => grocery.product === '' && grocery.amount === '')

//         addGrocery({id: week.id, groceryID: firstFreeGroceryIndex, item: ingredient, type: 'RECIPE_INGREDIENT_PRODUCT_ADD'})
//     }

//     return (
//         <div>
//             {week.total !== undefined ?
//                 <MainDashboardNavBar
//                     addWeek={() => startAddWeek({year: week.year})}
//                     addYear={() => startAddYear({week})}
//                     startPreviousWeek={() => previousWeek({week})}
//                     startNextWeek={() => nextWeek({week})}
//                     week={week}
//                 />
//                 :
//                 null
//             }
//             {Object.entries(week).length === 0 && week.constructor === Object ?
//             <div>
//             <p>No weeks. You should add a week!</p>
//             <button disabled={isLockedButton} onClick={startBeginFirstWeek}>Add first week!</button>
//             </div>
//             :
//             <div className="recipe-list">
//             {week.recipes ? week.recipes.map((recipe) => {
//                 return <MainDashboardRecipeCard key={recipe.day} recipe={recipe.recipeID} day={recipe.day} week={week} onClick={(ingredients) => setRecipeIngredientList(ingredients ? ingredients : [])}/>
//             })
//             :
//             null
//             }
//             </div>
//             }
//             <div className="grocery-list-recipe-ingredients-container">
//             {
//             localWeekGroceries ?
//             localWeekGroceries.length !== 0 ?
//                 <GroceryList groceries={localWeekGroceries} week={week}/>
//                 :
//                 <h2>Grocery List</h2>
//                 :
//                 null
//             }
//             <div>
//             {
//                 recipeIngredientList.length !== 0 ?
//                  <button onClick={() => setRecipeIngredientList([])}>x</button>
//                  :
//                  null
//             }
//             {
//                 recipeIngredientList.length !== 0 ?
//                 recipeIngredientList.map((ingredient) => {
//                 return (
//                 <div key={ingredient} className="recipe-ingredients_ingredient">
//                     <button onClick={() => startAddGrocery(ingredient)} className="recipe-ingredients_ingredient-add-button">Add</button>
//                     <p>{ingredient}</p>
//                 </div>
//                 )
//                 })
//                 :
//                 null
//             }
//             </div>
//             </div>
//         </div>
//     )
// }

// export default MainDashboard
