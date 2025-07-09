import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const ACTIONS = {
  ADD: "ADD_TOAST",
  UPDATE: "UPDATE_TOAST",
  DISMISS: "DISMISS_TOAST",
  REMOVE: "REMOVE_TOAST",
} as const;

type ActionType = typeof ACTIONS;
type ToastAction =
  | { type: ActionType["ADD"]; toast: ToasterToast }
  | { type: ActionType["UPDATE"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS"]; toastId?: string }
  | { type: ActionType["REMOVE"]; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let idCounter = 0;
const toastQueue = new Map<string, ReturnType<typeof setTimeout>>();
const subscribers: ((state: State) => void)[] = [];

let currentState: State = { toasts: [] };

// Generate unique toast ID
function createId() {
  idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER;
  return idCounter.toString();
}

// Internal reducer for state transitions
export const reducer = (state: State, action: ToastAction): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const id = action.toastId;

      // Add dismissed toast to removal queue
      if (id) {
        scheduleRemoval(id);
      } else {
        state.toasts.forEach((t) => scheduleRemoval(t.id));
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          id === undefined || t.id === id ? { ...t, open: false } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

// Internal dispatch function that updates global state and notifies listeners
function dispatch(action: ToastAction) {
  currentState = reducer(currentState, action);
  subscribers.forEach((fn) => fn(currentState));
}

// Remove toast after timeout
function scheduleRemoval(toastId: string) {
  if (toastQueue.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastQueue.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastQueue.set(toastId, timeout);
}

// API to create a toast
type ToastInput = Omit<ToasterToast, "id">;
function toast(props: ToastInput) {
  const id = createId();

  const close = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  const update = (next: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...next, id } });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) close();
      },
    },
  });

  return { id, dismiss: close, update };
}

// Hook to access toast state and actions in components
function useToast() {
  const [state, setState] = React.useState(currentState);

  React.useEffect(() => {
    subscribers.push(setState);
    return () => {
      const index = subscribers.indexOf(setState);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id?: string) => dispatch({ type: "DISMISS_TOAST", toastId: id }),
  };
}

export { useToast, toast };
