import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorModalProps, SupportCountrySchema } from '../channels.types'
import { getSupportedCountries } from "../channel.thunks";
import { RootState } from "../../../../root";
import {
  onWebSocketAccountStatusChanged, onWebSocketWhatsAppAccountStatusChange,
  onWebSocketWhatsAppQrCode, onWebSocketWhatsAppQrCodeFailure,
} from "../../inbox";

const uiInitialState = {
  qrcode: '',
  supportedCountries: [] as SupportCountrySchema[],
  qrcodeStatus: 'idle' as 'idle' | 'connecting' | 'connected' | 'rejected',
  qrError: {
    title: 'Error mirroring your WhatsApp account', description: '', isModalOpen: false,
  } as Pick<ErrorModalProps, 'title' | 'description'> & { isModalOpen: boolean },
};

const setQrError = (state: any, action: any) => {
  state.qrcode = '';
  state.qrcodeStatus = 'idle';
  state.qrError.description = action?.payload?.message
  state.qrError.isModalOpen = true;
}

const uiSlice = createSlice({
  name: 'channel_ui',
  initialState: uiInitialState,
  reducers: {
    resetQrCode(state) {
      state.qrcode = '';
      state.qrcodeStatus = 'idle';
    },
    setQrcodeStatus(state, action: PayloadAction<'idle' | 'connecting' | 'connected'>) {
      state.qrcodeStatus = action.payload;
    },
    setIsQrErrorModal(state, action: PayloadAction<boolean>) {
      state.qrError.isModalOpen = action.payload;
    },
    setQRError: setQrError,
  },
  extraReducers(builder) {
    builder
      .addCase(onWebSocketWhatsAppQrCode, (state, action) => {
        state.qrcode = action.payload.qrcode;
      })
      .addCase(onWebSocketWhatsAppQrCodeFailure, setQrError)
      .addCase(onWebSocketWhatsAppAccountStatusChange, (state, action) => {
        const { status } = action.payload;

        state.qrcodeStatus = status;
        if (status === 'connected') {
          state.qrcode = '';
        }
      })
      .addCase(getSupportedCountries.fulfilled, (state, action: any) => {
        const { supported_countries } = action.payload;

        state.supportedCountries = supported_countries;
      })
      .addCase(onWebSocketAccountStatusChanged, state => {
        if (state.qrcode) {
          state.qrcode = '';
        }
      })
  },
});

export const {
  resetQrCode, setQrcodeStatus, setIsQrErrorModal, setQRError,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export const selectUiState = createSelector(
  (state: RootState) => state.channel,
  channel => channel.ui
);

export const selectSupportedCountries = createSelector(
  selectUiState, (channelUi) => channelUi.supportedCountries
);

export const selectWhatsAppQrCode = createSelector(
  selectUiState, ui => ui.qrcode
);

export const selectWhatsAppQrCodeStatus = createSelector(
  selectUiState, ui => ui.qrcodeStatus
);

export const selectWhatsAppQrError = createSelector(
  selectUiState, ui => ui.qrError,
)
