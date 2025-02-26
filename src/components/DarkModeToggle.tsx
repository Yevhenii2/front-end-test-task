import clsx from "clsx";
import { toggleDarkMode } from "../store/slices/darkModeSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const DarkModeToggle = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

  return (
<button
  className={clsx(
    "px-6 py-3 text-sm font-semibold rounded-lg border",
    "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    "fixed bottom-6 right-6 shadow-lg",
    isDarkMode ? "bg-gray-800 text-white" : "bg-yellow-400 text-gray-800"
  )}
  onClick={() => dispatch(toggleDarkMode())}
>
  {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>
  );
};

export default DarkModeToggle;