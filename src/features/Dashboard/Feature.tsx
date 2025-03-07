import React, { createContext, useReducer } from "react";
import {
  createReducer,
  States,
  StatesTransition,
  useStateEffect,
  useSubsription,
} from "react-states";
import { ExcalidrawPreviews, StorageAction } from "../../environment/storage";
import { useEnvironment } from "../../environment";
import { useDevtools } from "react-states/devtools";

export type State =
  | {
      state: "LOADING_PREVIEWS";
    }
  | {
      state: "PREVIEWS_LOADED";
      excalidraws: ExcalidrawPreviews;
    }
  | {
      state: "PREVIEWS_ERROR";
      error: string;
    };

export type PublicFeature = States<State, any>;

export type Feature = States<State, StorageAction>;

type Transition = StatesTransition<Feature>;

const featureContext = createContext({} as PublicFeature);

const reducer = createReducer<Feature>({
  LOADING_PREVIEWS: {
    "STORAGE:FETCH_PREVIEWS_SUCCESS": (_, { excalidraws }): Transition => ({
      state: "PREVIEWS_LOADED",
      excalidraws,
    }),
    "STORAGE:FETCH_PREVIEWS_ERROR": (_, { error }): Transition => ({
      state: "PREVIEWS_ERROR",
      error,
    }),
  },
  PREVIEWS_LOADED: {},
  PREVIEWS_ERROR: {},
});

export const useFeature = () => React.useContext(featureContext);

export const FeatureProvider = ({
  children,
  initialState = {
    state: "LOADING_PREVIEWS",
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const { storage } = useEnvironment();
  const feature = useReducer(reducer, initialState);

  if (process.env.NODE_ENV === "development") {
    useDevtools("dashboard", feature);
  }

  const [state, dispatch] = feature;

  useSubsription(storage.subscription, dispatch);

  useStateEffect(state, "LOADING_PREVIEWS", () => storage.fetchPreviews());

  return (
    <featureContext.Provider value={feature}>
      {children}
    </featureContext.Provider>
  );
};
