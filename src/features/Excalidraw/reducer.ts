import { createReducer } from "react-states";
import { ExcalidrawData } from "../../environment/storage";
import { ExcalidrawContext, ExcalidrawEvent, BaseContext } from "./types";

import { getChangedData, hasChangedExcalidraw } from "../../utils";

const onDataUpdate = (
  { data, id }: { data: ExcalidrawData; id: string },
  context: ExcalidrawContext & BaseContext
): ExcalidrawContext => {
  if (id !== context.metadata.id) {
    return context;
  }
  const changedData = getChangedData(data, context.data);

  return changedData
    ? {
        ...context,
        data: changedData,
      }
    : context;
};

export const reducer = createReducer<ExcalidrawContext, ExcalidrawEvent>({
  LOADING: {
    "STORAGE:FETCH_EXCALIDRAW_SUCCESS": ({
      data,
      metadata,
      image,
    }): ExcalidrawContext => ({
      state: "LOADED",
      data,
      metadata,
      image,
      clipboard: {
        state: "NOT_COPIED",
      },
    }),
    "STORAGE:FETCH_EXCALIDRAW_ERROR": ({ error }): ExcalidrawContext => ({
      state: "ERROR",
      error,
    }),
  },
  LOADED: {
    INITIALIZE_CANVAS_SUCCESS: (_, context): ExcalidrawContext => ({
      ...context,
      state: "EDIT",
    }),
  },
  EDIT: {
    EXCALIDRAW_CHANGE: ({ data }, context): ExcalidrawContext =>
      hasChangedExcalidraw(context.data, data)
        ? {
            ...context,
            clipboard: {
              state: "NOT_COPIED",
            },
            state: "DIRTY",
            data,
          }
        : context,
    COPY_TO_CLIPBOARD: (_, context): ExcalidrawContext => ({
      ...context,
      clipboard: {
        state: "COPIED",
      },
    }),
    "STORAGE:EXCALIDRAW_DATA_UPDATE": onDataUpdate,
  },
  DIRTY: {
    SYNC: (_, context): ExcalidrawContext => ({
      ...context,
      state: "SYNCING",
    }),
    EXCALIDRAW_CHANGE: ({ data }, context): ExcalidrawContext =>
      hasChangedExcalidraw(context.data, data)
        ? {
            ...context,
            state: "DIRTY",
            data,
          }
        : context,
    "STORAGE:EXCALIDRAW_DATA_UPDATE": onDataUpdate,
  },
  SYNCING: {
    EXCALIDRAW_CHANGE: ({ data }, context): ExcalidrawContext =>
      hasChangedExcalidraw(context.data, data)
        ? {
            ...context,
            state: "SYNCING_DIRTY",
            data,
          }
        : context,
    "STORAGE:SAVE_EXCALIDRAW_SUCCESS": (
      { image, metadata },
      context
    ): ExcalidrawContext => ({
      ...context,
      state: "EDIT",
      metadata,
      image,
    }),
    "STORAGE:SAVE_EXCALIDRAW_ERROR": ({ error }): ExcalidrawContext => ({
      state: "ERROR",
      error,
    }),
    "STORAGE:EXCALIDRAW_DATA_UPDATE": onDataUpdate,
  },
  SYNCING_DIRTY: {
    EXCALIDRAW_CHANGE: ({ data }, context): ExcalidrawContext =>
      hasChangedExcalidraw(context.data, data)
        ? {
            ...context,
            state: "SYNCING_DIRTY",
            data,
          }
        : context,
    "STORAGE:SAVE_EXCALIDRAW_SUCCESS": (
      { metadata },
      context
    ): ExcalidrawContext => ({
      ...context,
      metadata,
      state: "DIRTY",
    }),
    "STORAGE:SAVE_EXCALIDRAW_ERROR": (_, context): ExcalidrawContext => ({
      ...context,
      state: "DIRTY",
    }),
    "STORAGE:EXCALIDRAW_DATA_UPDATE": onDataUpdate,
  },
  ERROR: {},
});
