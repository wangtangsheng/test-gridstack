import { createSlice } from '@reduxjs/toolkit'

const list1 = [{ id: 'item-1-1', x: 0, y: 0, w: 1, h: 1 }, { id: 'item-1-3', x: 1, y: 0, w: 1, h: 1 }, { id: 'item-1-4', x: 1, y: 0, w: 1, h: 1 }];
const list2 = [{ id: 'item-1-1', x: 0, y: 0, w: 1, h: 1 }, { id: 'item-1-5', x: 1, y: 0, w: 1, h: 1 }, { id: 'item-1-6', x: 1, y: 0, w: 1, h: 1 }]

const initialState = {
  value: [{ id: 'item-1-1', x: 0, y: 0, w: 1, h: 1 }, { id: 'item-1-2', x: 1, y: 0, w: 1, h: 1 }]
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    save: (state, action) => {
      state.value = action.payload;
    },
    changeItems(state, action) {
      state.value = action.payload ? list2 : list1
    }
  },
})

// Action creators are generated for each case reducer function
export const { save, changeItems } = counterSlice.actions

export default counterSlice.reducer