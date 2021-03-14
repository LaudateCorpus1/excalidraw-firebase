import React, { useEffect } from "react";
import { PickAction, States, useStates } from "react-states";
import { useDevtools } from "react-states/devtools";
import { useEnvironment } from "../environment";

export type Context =
  | {
      state: "INITIALIZING";
    }
  | {
      state: "DASHBOARD";
      isUrlDispatch: boolean;
    }
  | {
      state: "EXCALIDRAW";
      isUrlDispatch: boolean;
      id: string;
      userId: string;
    };

export type Action =
  | {
      type: "OPEN_DASBHOARD";
      isUrlDispatch?: boolean;
    }
  | {
      type: "OPEN_EXCALIDRAW";
      isUrlDispatch?: boolean;
      userId: string;
      id: string;
    };

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { router } = useEnvironment();
  const navigation = useStates<Context, Action>(
    {
      INITIALIZING: {
        OPEN_DASBHOARD,
        OPEN_EXCALIDRAW,
      },
      DASHBOARD: {
        OPEN_EXCALIDRAW,
      },
      EXCALIDRAW: {
        OPEN_DASBHOARD,
        OPEN_EXCALIDRAW,
      },
    },
    {
      state: "INITIALIZING",
    }
  );

  if (process.env.NODE_ENV === "development") {
    useDevtools("navigation", navigation);
  }

  useEffect(() => {
    router.on("/", function () {
      navigation.dispatch({ type: "OPEN_DASBHOARD", isUrlDispatch: true });
    });

    router.on<{ userId: string; id: string }>("/:userId/:id", (params) => {
      navigation.dispatch({
        type: "OPEN_EXCALIDRAW",
        isUrlDispatch: true,
        id: params.id,
        userId: params.userId,
      });
    });

    router.resolve();
  }, []);

  useEffect(
    () =>
      navigation.exec({
        DASHBOARD: ({ isUrlDispatch }) => {
          !isUrlDispatch && router.navigate(`/`);
        },
        EXCALIDRAW: ({ isUrlDispatch, userId, id }) => {
          !isUrlDispatch && router.navigate(`/${userId}/${id}`);
        },
      }),
    [navigation]
  );

  return <context.Provider value={navigation}>{children}</context.Provider>;
};

const context = React.createContext({} as States<Context, Action>);

export const useNavigation = () => React.useContext(context);

function OPEN_EXCALIDRAW({
  id,
  userId,
  isUrlDispatch,
}: PickAction<Action, "OPEN_EXCALIDRAW">): Context {
  return {
    state: "EXCALIDRAW",
    id,
    userId,
    isUrlDispatch: Boolean(isUrlDispatch),
  };
}

function OPEN_DASBHOARD({
  isUrlDispatch,
}: PickAction<Action, "OPEN_DASBHOARD">): Context {
  return { state: "DASHBOARD", isUrlDispatch: Boolean(isUrlDispatch) };
}
