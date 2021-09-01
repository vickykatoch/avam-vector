import React from "react";
import { AppState } from "./models";
import { reducer } from "./reducer";

interface TestContextProps {
    appState: AppState,
    dispatch: any;
}

const TestContext = React.createContext({} as TestContextProps);

const useTextContext = () => React.useContext(TestContext);

const TestContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appState, dispatch] = React.useReducer<AppState,>(reducer, { value: 0 });

    return <TestContext.Provider value={{
        appState,
        dispatch
    }}>
        {children}
    </TestContext.Provider>
};

export default TestContextProvider;
