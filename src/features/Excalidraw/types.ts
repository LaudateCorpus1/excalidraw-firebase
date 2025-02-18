import { States, StatesTransition } from "react-states";
import {
  ExcalidrawData,
  ExcalidrawElement,
  ExcalidrawMetadata,
  StorageAction,
} from "../../environment/storage";

export type { ExcalidrawElement, ExcalidrawData, ExcalidrawMetadata };

export type ClipboardState =
  | {
      state: "COPIED";
    }
  | {
      state: "NOT_COPIED";
    };

export type BaseState = {
  data: ExcalidrawData;
  metadata: ExcalidrawMetadata;
  image: Blob;
  clipboard: ClipboardState;
};

export type State =
  | {
      state: "LOADING";
    }
  | {
      state: "ERROR";
      error: string;
    }
  | (BaseState &
      (
        | {
            state: "LOADED";
          }
        | {
            state: "EDIT";
          }
        | {
            state: "DIRTY";
          }
        | {
            state: "SYNCING";
          }
        | {
            state: "SYNCING_DIRTY";
          }
      ));

export type Command =
  | {
      cmd: "COPY_TO_CLIPBOARD";
      image: Blob;
    }
  | {
      cmd: "SAVE_TITLE";
      title: string;
    };

export type PublicAction =
  | {
      type: "INITIALIZE_CANVAS_SUCCESS";
    }
  | {
      type: "COPY_TO_CLIPBOARD";
    }
  | {
      type: "EXCALIDRAW_CHANGE";
      data: ExcalidrawData;
    }
  | {
      type: "SAVE_TITLE";
      title: string;
    };

export type PrivateAction = {
  type: "SYNC";
};

export type PublicFeature = States<State, PublicAction>;

export type Feature = States<
  State,
  PublicAction | PrivateAction | StorageAction,
  Command
>;

export type Transition = StatesTransition<Feature>;
