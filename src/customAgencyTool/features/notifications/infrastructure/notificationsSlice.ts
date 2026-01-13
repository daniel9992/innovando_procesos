import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';

interface NotificationsSliceState {
  isSidebarOpen: boolean;
}

const initialState: NotificationsSliceState = {
  isSidebarOpen: false,
};

export const notificationsSlice = createAppSlice({
  name: 'notifications',
  initialState,
  reducers: (create) => ({
    toggleSidebar: create.reducer((state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }),
  }),
  selectors: {
    selectIsSidebarOpen: (state) => state.isSidebarOpen,
  },
});

export const { toggleSidebar } = notificationsSlice.actions;

export const { selectIsSidebarOpen } = notificationsSlice.selectors;
