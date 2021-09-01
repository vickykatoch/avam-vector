import React, {createContext} from 'react';

interface ContextProps {
    userName: string;
    loggedInSince: number;
}

export const AppContext = createContext<ContextProps>({
    userName:'Guest',
    loggedInSince:0
});

export const AppContextProvider: React.FC =({children}) => {
    
    return (
        <AppContext.Provider value={{
            userName: 'BK',
            loggedInSince: 10
        }}>
            {children}
        </AppContext.Provider>
    );
};
