import { createStore } from 'redux';

export interface RootState {
  id: number;
  username: string;
  ids: string[];
  token: string;
}

const initialState: RootState = {
  id: -1,
  username: '',
  ids: [],
  token: ''
};

const reducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    case 'SET_ID':
      return {
        ...state,
        id: action.payload,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'ADD_ID':
      return {
        ...state,
        ids: [...state.ids, action.payload],
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;

export const addId = (id: number) => ({
  type: 'ADD_ID',
  payload: id,
});
