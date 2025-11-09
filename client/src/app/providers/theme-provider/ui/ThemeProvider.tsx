import { createContext, type ReactNode, useEffect, useState } from "react";

interface ContextProps {
  darkTheme: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ContextProps>({
  darkTheme: true,
  toggleTheme: () => {},
});

interface IProps {
  children?: ReactNode;
}

export default function ThemeProvider(props: IProps) {
  const { children } = props;
  const [darkTheme, setDarkTheme] = useState(
    () => window.Telegram.WebApp.colorScheme === "dark",
  );

  const toggleThemeHandler = () => {
    setDarkTheme((prevState) => !prevState);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkTheme ? "dark" : "light",
    );
  }, [darkTheme]);

  return (
    <ThemeContext.Provider
      value={{
        darkTheme: darkTheme,
        toggleTheme: toggleThemeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
