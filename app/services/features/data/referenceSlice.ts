import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReferenceItem } from "./referenceApi";

interface ReferenceState {
  locations: ReferenceItem[];
  genders: ReferenceItem[];
}

const initialState: ReferenceState = {
  locations: [],
  genders: [],
};

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    setReferences: (state, action: PayloadAction<Partial<ReferenceState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setReferences } = referenceSlice.actions;
export default referenceSlice.reducer;