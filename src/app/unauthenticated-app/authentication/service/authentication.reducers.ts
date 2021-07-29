import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../../../root';
import {
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
} from './authentication.service';
import { AuthInitialState, UserProfile, User } from './types';
import { ForgotPasswordInitialValuesProps } from '../components';
const initialState = {
  user: null,
  token: null,
  profile: null,
  organisations: null,
  forgotPasswordToken: null,
  loading: false,
} as AuthInitialState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUser(state, action) {
      const { user, token, profile, organisations } = action.payload;
      state.user = user;
      state.token = token;
      state.profile = profile;
      state.organisations = organisations;
    },
    logUserOut(state) {
      state.user = null;
      state.token = null;
      state.profile = null;
      state.organisations = null;
    },
    setForgotPasswordToken(state, action: PayloadAction<{ token: string }>) {
      const { token } = action.payload;
      state.token = token;
    },
    setAuthLoading(state, action: PayloadAction<{ loading: boolean }>) {
      state.loading = action.payload.loading;
    },
  },
});

export const { saveUser, logUserOut, setForgotPasswordToken, setAuthLoading } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const fetchProfile = (organizationID: string) => async (dispatch: AppDispatch) => {
  const data = await getProfile(organizationID);
  dispatch(saveUser(data));
  return data;
};

export const editProfile = (
  values: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'organisation_id'>> & {
    user_id: User['id'];
  },
) => async (dispatch: AppDispatch) => {
  const data = await updateProfile(values);
  dispatch(saveUser(data));
  return data;
};

export const editPassword = (values: {
  old_password: string;
  new_password: string;
}) => async () => {
  return await changePassword(values);
};

export const forgotPasswordAsync = (
  values: ForgotPasswordInitialValuesProps & { link: string },
) => async (dispatch: AppDispatch) => {
  const { reset } = await forgotPassword(values);
  dispatch(setForgotPasswordToken({ token: reset.token }));
  return reset;
};

export const authLoading = (loading: boolean) => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading({ loading }));
  return loading;
};

export const selectProfile = createSelector(
  (state: RootState) => state.auth,
  auth => auth.profile,
);

export const selectOrganisationID = createSelector(
  selectProfile,
  profile => profile?.organisation_id ?? '',
);

export const selectUserID = createSelector(selectProfile, profile => profile?.user_id);

export const selectUser = createSelector(
  (state: RootState) => state.auth,
  auth => auth.user,
);

export const selectUserEmail = createSelector(selectUser, user => user?.email || '');
