import {
  ExcalidrawData,
  ExcalidrawElement,
  ExcalidrawMetadata,
} from "../../environment/storage";

export type { ExcalidrawElement, ExcalidrawData, ExcalidrawMetadata };

export type ClipboardContext =
  | {
      state: "COPIED";
    }
  | {
      state: "NOT_COPIED";
    };

export type BaseContext = {
  data: ExcalidrawData;
  metadata: ExcalidrawMetadata;
  image: Blob;
  clipboard: ClipboardContext;
};

export type ExcalidrawContext =
  | {
      state: "LOADING";
    }
  | {
      state: "ERROR";
      error: string;
    }
  | (BaseContext &
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
        | {
            state: "UNFOCUSED";
          }
        | {
            state: "FOCUSED";
          }
        | {
            state: "UPDATING";
          }
        | {
            state: "UPDATING_FROM_PEER";
          }
      ));

export const LOADING_SUCCESS = Symbol("LOADING_SUCCESS");
export const LOADING_ERROR = Symbol("LOADING_ERROR");
export const SYNC = Symbol("SYNC");
export const SYNC_ERROR = Symbol("SYNC_ERROR");
export const SYNC_SUCCESS = Symbol("SYNC_SUCCESS");
export const FOCUS = Symbol("FOCUS");
export const BLUR = Symbol("BLUR");
export const REFRESH = Symbol("REFRESH");
export const CONTINUE = Symbol("CONTINUE");
export const SUBSCRIPTION_UPDATE = Symbol("SUBSCRIPTION_UPDATE");

export type ExcalidrawAction =
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
      type: typeof LOADING_SUCCESS;
      data: ExcalidrawData;
      metadata: ExcalidrawMetadata;
      image: Blob;
    }
  | {
      type: typeof LOADING_ERROR;
      error: string;
    }
  | {
      type: typeof SYNC;
    }
  | {
      type: typeof SYNC_ERROR;
      error: string;
    }
  | {
      type: typeof SYNC_SUCCESS;
      image: Blob;
      metadata: ExcalidrawMetadata;
    }
  | {
      type: typeof SYNC_ERROR;
    }
  | {
      type: typeof FOCUS;
    }
  | {
      type: typeof BLUR;
    }
  /**
   *  When user focuses tab with a dirty change, go grab latest
   * from storage
   */
  | {
      type: typeof REFRESH;
    }
  /**
   * When user focuses tab with a dirty change, continue
   * with client version
   */
  | {
      type: typeof CONTINUE;
    }
  | {
      type: typeof SUBSCRIPTION_UPDATE;
      data: ExcalidrawData;
    };
