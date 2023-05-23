// External imports
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";

// Internal imports
import RecipeForm from "../RecipeForm/RecipeForm";

const RecipeEdit = (props) => {
    const startRecipeListener = useStoreActions(
        (actions) => actions.recipes.startRecipeListener
    );
    const stopRecipeListener = useStoreActions(
        (actions) => actions.recipes.stopRecipeListener
    );
    const currentRecipe = useStoreState((state) => state.recipes.currentRecipe);
    const startRecipeCategoryNamesListener = useStoreActions(
        (actions) => actions.recipes.startRecipeCategoryNamesListener
    );
    const stopRecipeCategoryNamesListener = useStoreActions(
        (actions) => actions.recipes.stopRecipeCategoryNamesListener
    );
    const updateRecipe = useStoreActions(
        (actions) => actions.recipes.updateRecipe
    );
    const recipeCategoryNames = useStoreState(
        (state) => state.recipes.recipeCategoryNames
    );
    const recipeid = useParams().id;
    const { weekid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        startRecipeListener({ recipeid });
        startRecipeCategoryNamesListener();
        return () => {
            stopRecipeListener();
            stopRecipeCategoryNamesListener();
        };
    }, []);
    const startUpdateRecipe = (recipe) => {
        updateRecipe({
            type: "FULL_UPDATE",
            recipeid: currentRecipe.recipeid,
            recipeObj: recipe,
            recipeNamesObj: {
                link: recipe.link,
                recipeName: recipe.name,
            },
        }).then(() => {
            navigate(`/manage-recipes/${weekid}`);
        });
    };

    const handleDeleteRecipe = (recipeid) => {
        updateRecipe({
            type: "RECIPE_DELETE",
            recipeid,
        }).then(() => {
            navigate(`/manage-recipes/${weekid}`);
        });
    };

    return (
        <div>
            {/* <button onClick={() => updateRecipe({type: 'RECIPE_CATEGORY', recipeid: '-M9nvR8-gGP0bc7Ws9ny'})}>pres me</button> */}
            {currentRecipe && recipeCategoryNames && (
                <RecipeForm
                    weekid={weekid}
                    recipe={currentRecipe}
                    onSubmit={startUpdateRecipe}
                    recipeCategoryNames={recipeCategoryNames}
                    deleteRecipe={handleDeleteRecipe}
                />
            )}
        </div>
    );
};

export default RecipeEdit;
