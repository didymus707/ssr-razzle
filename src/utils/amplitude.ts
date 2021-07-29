// import amplitude from 'amplitude-js'
let amplitude = {
  getInstance: () => ({
    init: (key: string) => {},
    setUserId: (id: string) => {},
    setDeviceId: (id: string) => {},
    setUserProperties: (properties: any) => {},
    logEvent: (eventType: string, eventProperties?: any) => {},
  }),
};
if (typeof window !== 'undefined') {
  amplitude = require('amplitude-js/amplitude');
}

export const initAmplitude = () => {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE ?? '');
};

export const setAmplitudeUserDevice = (installationToken: string) => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: string | null) => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = (properties: any) => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (eventType: string, eventProperties?: any) => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};
