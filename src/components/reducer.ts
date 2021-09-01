import { AppState } from './models';

interface ReducerAction {
    type: 'ADD1' | 'ADD5' | 'ADD20' | 'ADD100' | 'BUSY';
    payload?: number;
}
// export type ReducerType 

export function reducer(state: AppState, action: ReducerAction): AppState {
    switch (action.type) {
        case 'BUSY':
            return { ...state, busy: true };
        case 'ADD1':
        case 'ADD5':
        case 'ADD20':
        case 'ADD100':
            const num = action.payload!;
            return { ...state, busy: false, value: (state.value || 0) + num};
        default:
            return state;
    }
}