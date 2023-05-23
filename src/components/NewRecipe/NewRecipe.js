// External imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";

// Internal imports
import NewRecipeForm from "../NewRecipeForm";
import LoadingPage from "../LoadingPage/LoadingPage";

const NewRecipe = (props) => {
    const newRecipe = useStoreActions((actions) => actions.recipes.newRecipe);
    const startRecipeCategoryNamesListener = useStoreActions(
        (actions) => actions.recipes.startRecipeCategoryNamesListener
    );
    const stopRecipeCategoryNamesListener = useStoreActions(
        (actions) => actions.recipes.stopRecipeCategoryNamesListener
    );
    const recipeCategoryNames = useStoreState(
        (state) => state.recipes.recipeCategoryNames
    );

    const [loading, setLoading] = useState(false);
    const { weekid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        startRecipeCategoryNamesListener();
        return () => {
            stopRecipeCategoryNamesListener();
        };
    }, []);

    const startNewRecipe = (recipe) => {
        setLoading(true);
        newRecipe({
            type: "FULL_UPDATE",
            recipeObj: recipe,
            recipeNamesObj: {
                link: recipe.link,
                recipeName: recipe.name,
            },
        }).then(() => {
            navigate(`/manage-recipes/${weekid}`);
        });
    };

    return (
        <div>
            {recipeCategoryNames && !loading && (
                <NewRecipeForm
                    weekid={weekid}
                    recipe={{}}
                    onSubmit={startNewRecipe}
                    recipeCategoryNames={recipeCategoryNames}
                />
            )}
            {loading && <LoadingPage />}
        </div>
    );
};

export default NewRecipe;
