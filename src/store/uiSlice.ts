import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  signupModalOpen: boolean;
}

const initialState: UIState = {
  signupModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSignUpModalState(state, action: PayloadAction<boolean>) {
      state.signupModalOpen = action.payload;
    },
  },
});

export const { setSignUpModalState } = uiSlice.actions;

export default uiSlice.reducer;
