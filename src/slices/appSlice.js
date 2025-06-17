import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ruya: "",
  seciliYorumcu: "",
  yorumHazirlaniyor: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRuya: (state, action) => {
      state.ruya = action.payload;
    },
    setSeciliYorumcu: (state, action) => {
      state.seciliYorumcu = action.payload;
    },
    setYorumHazirlaniyor: (state, action) => {
      state.yorumHazirlaniyor = action.payload;
    },
  },
});

export const { setRuya, setSeciliYorumcu, setYorumHazirlaniyor } =
  appSlice.actions;

export default appSlice.reducer;
