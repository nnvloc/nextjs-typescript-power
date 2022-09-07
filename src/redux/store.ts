import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import counterReducer from './reducers/counterSlice';
import resultsReducer from './reducers/resultsSlice';
import numbersReducer from './reducers/numbersSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    results: resultsReducer,
    numbers: numbersReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
