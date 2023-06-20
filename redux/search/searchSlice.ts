import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
  loading: false,
  error: false,
  errorMessage: undefined,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => { },
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
