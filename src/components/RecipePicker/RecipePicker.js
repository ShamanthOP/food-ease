// External imports
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useNavigate, useParams } from "react-router-dom";

// Internal imports
import LoadingPage from "../LoadingPage/LoadingPage";
import RecipePickerCard from "../RecipePickerCard/RecipePickerCard";
import "./RecipePicker.scss";
import { ReactComponent as LeftArrow } from "./utils/left-arrow.svg";
import { ReactComponent as Trash } from "./utils/trash.svg";

const RecipePicker = (props) => {
    const startRecipeListListener = useStoreActions(
        (actions) => actions.recipes.startRecipeListListener
    );
    const stopRecipeListListener = useStoreActions(
        (actions) => actions.recipes.stopRecipeListListener
    );
    const updateWeek = useStoreActions(
        (actions) => actions.newWeeks.updateWeek
    );
    const recipes = useStoreState((state) => state.recipes.currentRecipeList);

    const [backBanner, setBackBanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const { weekid, day } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        startRecipeListListener().then(() => {
            setLoading(true);
        });
        return () => {
            stopRecipeListListener();
        };
    }, []);

    const pickRecipe = ({ recipeid, name }) => {
        updateWeek({
            type: "RECIPE_UPDATE",
            recipeid,
            recipeName: name,
            weekid: weekid,
            day: day,
        }).then(() => {
            navigate(`/dashboard/${weekid}`);
        });
    };

    const handleReturn = () => {
        navigate(`/dashboard/${weekid}`);
    };

    const handleRemoveRecipe = () => {
        updateWeek({
            type: "RECIPE_REMOVE",
            weekid: weekid,
            day: day,
        }).then(() => {
            navigate(`/dashboard/${weekid}`);
        });
    };

    return (
        <div id="recipe-picker-outer-container">
            {loading ? (
                <div id="recipe-picker-outer-container">
                    <div id="recipe-picker-title">
                        <div id="recipe-picker-title-back-container">
                            <div id="recipe-picker-title-back-inner-container">
                                <LeftArrow
                                    id="recipe-picker-title-back-icon"
                                    onClick={handleReturn}
                                    onMouseOver={() => setBackBanner(true)}
                                    onMouseLeave={() => setBackBanner(false)}
                                />
                                {backBanner ? "Back to dashboard" : null}
                            </div>
                        </div>
                        <h2 id="recipe-picker-title-text">
                            Pick a recipe for {day}
                            <Trash
                                id="recipe-picker-trash"
                                onClick={handleRemoveRecipe}
                            />
                        </h2>
                    </div>
                    {recipes && (
                        <div id="recipe-picker-container">
                            <div id="recipe-manager_card-list">
                                {recipes.map((recipe) => {
                                    return (
                                        <RecipePickerCard
                                            key={recipe.recipeid}
                                            name={recipe.name}
                                            link={recipe.link}
                                            recipeid={recipe.recipeid}
                                            ingredients={recipe.ingredients}
                                            onClick={pickRecipe}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {recipes.length === 0 && (
                        <div id="recipe-picker-add-recipe-container">
                            <h2 id="recipe-picker-no-recipes">
                                You have no recipes :(
                            </h2>
                            <Link
                                id="recipe-picker-add-recipe"
                                to={`/new-recipe/${weekid}`}
                            >
                                Add a recipe
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div id="recipe-picker-loading">
                    <LoadingPage />
                </div>
            )}
        </div>
    );
};

export default RecipePicker;
