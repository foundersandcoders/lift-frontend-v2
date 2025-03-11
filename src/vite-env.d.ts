/// <reference types="vite/client" />

interface Window {
  React?: {
    useLayoutEffect?: Function;
    useEffect?: Function;
  };
}
