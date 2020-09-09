import { Component, createElement, Fragment } from 'react';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionState, UserAgent, Registerer, RegistererState, Inviter } from 'sip.js';
import Select from 'react-select';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

var styles = {"container":"_styles__container__1H7C6"};

const NEW_USERAGENT = 'NEW_USERAGENT';
const NEW_ACCOUNT = 'NEW_ACCOUNT';
const setNewAccount = account => {
  return {
    type: NEW_ACCOUNT,
    payload: account
  };
};

const NEW_SESSION = 'NEW_SESSION';
const NEW_ATTENDED_TRANSFER = 'NEW_ATTENDED_TRANSFER';
const INCOMING_CALL = 'INCOMING_CALL';
const ACCEPT_CALL = 'ACCEPT_CALL';
const DECLINE_CALL = 'DECLINE_CALL';
const SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE';
const CLOSE_SESSION = 'CLOSE_SESSION';
const SIPSESSION_HOLD_REQUEST = 'SIPSESSION_HOLD_REQUEST';
const SIPSESSION_HOLD_FAIL = 'SIPSESSION_HOLD_FAIL';
const SIPSESSION_UNHOLD_REQUEST = 'SIPSESSION_UNHOLD_REQUEST';
const SIPSESSION_UNHOLD_FAIL = 'SIPSESSION_UNHOLD_FAIL';
const SIPSESSION_MUTE_REQUEST = 'SIPSESSION_MUTE_REQUEST';
const SIPSESSION_MUTE_SUCCESS = 'SIPSESSION_MUTE_SUCCESS';
const SIPSESSION_MUTE_FAIL = 'SIPSESSION_MUTE_FAIL';
const SIPSESSION_UNMUTE_REQUEST = 'SIPSESSION_UNMUTE_REQUEST';
const SIPSESSION_UNMUTE_SUCCESS = 'SIPSESSION_UNMUTE_SUCCESS';
const SIPSESSION_UNMUTE_FAIL = 'SIPSESSION_UNMUTE_FAIL';
const SIPSESSION_BLIND_TRANSFER_REQUEST = 'SIPSESSION_BLIND_TRANSFER_REQUEST';
const SIPSESSION_BLIND_TRANSFER_SUCCESS = 'SIPSESSION_BLIND_TRANSFER_SUCCESS';
const SIPSESSION_BLIND_TRANSFER_FAIL = 'SIPSESSION_BLIND_TRANSFER_FAIL';
const SIPSESSION_ATTENDED_TRANSFER_REQUEST = 'SIPSESSION_ATTENDED_TRANSFER_REQUEST';
const SIPSESSION_ATTENDED_TRANSFER_PENDING = 'SIPSESSION_ATTENDED_TRANSFER_PENDING';
const SIPSESSION_ATTENDED_TRANSFER_READY = 'SIPSESSION_ATTENDED_TRANSFER_READY';
const SIPSESSION_ATTENDED_TRANSFER_CANCEL = 'SIPSESSION_ATTENDED_TRANSFER_CANCEL';
const SIPSESSION_ATTENDED_TRANSFER_FAIL = 'SIPSESSION_ATTENDED_TRANSFER_FAIL';
const SIPSESSION_ATTENDED_TRANSFER_SUCCESS = 'SIPSESSION_ATTENDED_TRANSFER_SUCCESS';
const stateChange = (newState, id) => dispatch => {
  dispatch({
    type: SIPSESSION_STATECHANGE,
    payload: {
      state: newState,
      id
    }
  });
};
const closeSession = id => dispatch => {
  dispatch({
    type: CLOSE_SESSION,
    payload: id
  });
};
const acceptCall = session => {
  return {
    type: ACCEPT_CALL,
    payload: session
  };
};
const declineCall = session => {
  return {
    type: DECLINE_CALL,
    payload: session
  };
};
const endCall = sessionId => {
  return {
    type: CLOSE_SESSION,
    payload: sessionId
  };
};
const holdCallRequest = session => dispatch => {
  if (!session.sessionDescriptionHandler || session.state !== SessionState.Established) {
    return {
      type: SIPSESSION_HOLD_FAIL
    };
  }

  try {
    session.invite({
      sessionDescriptionHandlerModifiers: [session.sessionDescriptionHandler.holdModifier]
    });
    dispatch({
      type: SIPSESSION_HOLD_REQUEST,
      payload: session.id
    });
  } catch (err) {
    dispatch({
      type: SIPSESSION_HOLD_FAIL
    });
  }

  return;
};
const unHoldCallRequest = (session, onHolds, sessions) => dispatch => {
  for (let [sessionId, _session] of Object.entries(sessions)) {
    if (onHolds.indexOf(sessionId) < 0 && sessionId !== session.id && _session.state === 'Established') {
      try {
        _session.invite({
          sessionDescriptionHandlerModifiers: [_session.sessionDescriptionHandler.holdModifier]
        });

        dispatch({
          type: SIPSESSION_HOLD_REQUEST,
          payload: _session.id
        });
      } catch (err) {
        dispatch({
          type: SIPSESSION_HOLD_FAIL
        });
      }
    }
  }

  try {
    session.invite();
    dispatch({
      type: SIPSESSION_UNHOLD_REQUEST,
      payload: session.id
    });
  } catch (err) {
    dispatch({
      type: SIPSESSION_UNHOLD_FAIL
    });
  }

  return;
};
const blindTransferRequest = () => dispatch => {
  dispatch({
    type: SIPSESSION_BLIND_TRANSFER_REQUEST
  });
};
const blindTransferSuccess = () => dispatch => {
  dispatch({
    type: SIPSESSION_BLIND_TRANSFER_SUCCESS
  });
};
const blindTransferFail = () => dispatch => {
  dispatch({
    type: SIPSESSION_BLIND_TRANSFER_FAIL
  });
};
const attendedTransferRequest = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_REQUEST
  });
};
const attendedTransferCancel = session => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_CANCEL,
    payload: session
  });
};
const attendedTransferReady = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_READY
  });
};
const attendedTransferPending = session => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_PENDING,
    payload: session
  });
};
const attendedTransferSuccess = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_SUCCESS
  });
};
const attendedTransferFail = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_FAIL
  });
};
const muteRequest = () => dispatch => {
  dispatch({
    type: SIPSESSION_MUTE_REQUEST
  });
};
const muteSuccess = () => dispatch => {
  dispatch({
    type: SIPSESSION_MUTE_SUCCESS
  });
};
const muteFail = () => dispatch => {
  dispatch({
    type: SIPSESSION_MUTE_FAIL
  });
};
const unMuteRequest = () => dispatch => {
  dispatch({
    type: SIPSESSION_UNMUTE_REQUEST
  });
};
const unMuteSuccess = () => dispatch => {
  dispatch({
    type: SIPSESSION_UNMUTE_SUCCESS
  });
};
const unMuteFail = () => dispatch => {
  dispatch({
    type: SIPSESSION_UNMUTE_FAIL
  });
};

const SET_CREDENTIALS = 'SET_CREDENTIALS';
const SET_PHONE_CONFIG = 'SET_PHONE_CONFIG';
const SET_APP_CONFIG = 'SET_APP_CONFIG';
const STRICT_MODE_SHOW_CALL_BUTTON = 'STRICT_MODE_SHOW_CALL_BUTTON';
const STRICT_MODE_HIDE_CALL_BUTTON = 'STRICT_MODE_HIDE_CALL_BUTTON';
const ATTENDED_TRANSFER_LIMIT_REACHED = 'ATTENDED_TRANSFER_LIMIT_REACHED';
const SESSIONS_LIMIT_REACHED = 'SESSIONS_LIMIT_REACHED';
const setCredentials = (uri = '', password = '') => {
  return {
    type: SET_CREDENTIALS,
    payload: {
      uri,
      password
    }
  };
};
const setPhoneConfig = config => {
  return {
    type: SET_PHONE_CONFIG,
    payload: config
  };
};
const setAppConfig = config => {
  return {
    type: SET_APP_CONFIG,
    payload: config
  };
};
const setAppConfigStarted = () => {
  return {
    type: STRICT_MODE_SHOW_CALL_BUTTON
  };
};
const attendedTransferLimitReached = () => {
  return {
    type: ATTENDED_TRANSFER_LIMIT_REACHED
  };
};
const sessionsLimitReached = () => {
  return {
    type: SESSIONS_LIMIT_REACHED
  };
};

const holdAll = id => {
  const state = phoneStore.getState();
  const onHolds = state.sipSessions.onHold;
  const sessions = state.sipSessions.sessions;

  for (let [sessionId, session] of Object.entries(sessions)) {
    if (onHolds.indexOf(sessionId) < 0 && sessionId !== id) {
      try {
        holdCallRequest(session);
        phoneStore.dispatch({
          type: SIPSESSION_HOLD_REQUEST,
          payload: session.id
        });
        return;
      } catch (err) {
        return;
      }
    }
  }
};

const AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED';
const AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED';
const REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED';
const REMOTE_AUDIO_FAIL = 'REMOTE_AUDIO_FAIL';
const LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED';
const SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT';
const SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT';
const SET_LOCAL_AUDIO_SESSIONS_PENDING = 'SET_LOCAL_AUDIO_SESSIONS_PENDING';
const SET_LOCAL_AUDIO_SESSION_SUCCESS = 'SET_LOCAL_AUDIO_SESSION_SUCCESS';
const SET_LOCAL_AUDIO_SESSION_FAIL = 'SET_LOCAL_AUDIO_SESSION_FAIL';
const SET_REMOTE_AUDIO_SESSIONS_PENDING = 'SET_REMOTE_AUDIO_SESSIONS_PENDING';
const SET_REMOTE_AUDIO_SESSION_SUCCESS = 'SET_REMOTE_AUDIO_SESSION_SUCCESS';
const SET_REMOTE_AUDIO_SESSION_FAIL = 'SET_REMOTE_AUDIO_SESSION_FAIL';
const AUDIO_SINKID_NOT_ALLOWED = 'AUDIO_SINKID_NOT_ALLOWED';
const getInputAudioDevices = () => {
  let inputArray = [];
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind === 'audioinput') {
        inputArray.push(device);
      }
    });
  });
  return {
    type: AUDIO_INPUT_DEVICES_DETECTED,
    payload: inputArray
  };
};
const getOutputAudioDevices = () => {
  let outputArray = [];
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind === 'audiooutput') {
        outputArray.push(device);
      }
    });
  });
  return {
    type: AUDIO_OUTPUT_DEVICES_DETECTED,
    payload: outputArray
  };
};
const setPrimaryOutput = (deviceId, sessions) => dispatch => {
  if (sessions) {
    if (Object.keys(sessions).length > 0) {
      dispatch({
        type: SET_REMOTE_AUDIO_SESSIONS_PENDING
      });

      for (let [sessionId, _session] of Object.entries(sessions)) {
        if (_session.state === 'Established') {
          try {
            const mediaElement = document.getElementById(sessionId);
            const remoteStream = new MediaStream();

            _session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
              if (receiver.track) {
                remoteStream.addTrack(receiver.track);
              }
            });

            if (mediaElement) {
              mediaElement.setSinkId(deviceId).then(() => {
                mediaElement.srcObject = remoteStream;
                mediaElement.play();
              });
            } else {
              console.log('no media Element');
            }
          } catch (err) {
            console.log(err);
            dispatch({
              type: SET_REMOTE_AUDIO_SESSION_FAIL
            });
            return;
          }
        }

        dispatch({
          type: SET_REMOTE_AUDIO_SESSION_SUCCESS
        });
      }
    }
  }

  dispatch({
    type: SET_PRIMARY_OUTPUT,
    payload: deviceId
  });
};
const setPrimaryInput = (deviceId, sessions, sinkIdAllowed) => dispatch => {
  if (sessions) {
    if (Object.keys(sessions).length > 0) {
      dispatch({
        type: SET_LOCAL_AUDIO_SESSIONS_PENDING
      });

      for (let [sessionId, _session] of Object.entries(sessions)) {
        if (_session.state === 'Established') {
          try {
            _session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
              console.log(sessionId);

              if (sender.track && sender.track.kind === 'audio') {
                let audioDeviceId = deviceId;
                navigator.mediaDevices.getUserMedia({
                  audio: {
                    deviceId: audioDeviceId
                  }
                }).then(function (stream) {
                  let audioTrack = stream.getAudioTracks();
                  sender.replaceTrack(audioTrack[0]);
                });
              }
            });
          } catch (err) {
            console.log(err);
            dispatch({
              type: SET_LOCAL_AUDIO_SESSION_FAIL
            });
            return;
          }
        }

        dispatch({
          type: SET_LOCAL_AUDIO_SESSION_SUCCESS
        });
      }
    }
  }

  dispatch({
    type: SET_PRIMARY_INPUT,
    payload: deviceId
  });

  if (sinkIdAllowed === false) {
    if (sessions) {
      if (Object.keys(sessions).length > 0) {
        for (let [sessionId, _session] of Object.entries(sessions)) {
          if (_session.state === 'Established') {
            try {
              const mediaElement = document.getElementById(sessionId);
              const remoteStream = new MediaStream();

              _session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
                if (receiver.track) {
                  remoteStream.addTrack(receiver.track);
                }
              });

              if (mediaElement) {
                mediaElement.srcObject = remoteStream;
                mediaElement.play();
              } else {
                console.log('no media Element');
              }
            } catch (err) {
              console.log(err);
              dispatch({
                type: SET_REMOTE_AUDIO_SESSION_FAIL
              });
              return;
            }
          }

          dispatch({
            type: SET_REMOTE_AUDIO_SESSION_SUCCESS
          });
        }
      }
    }
  }
};

const setRemoteAudio = session => {
  const state = phoneStore.getState();
  const deviceId = state.device.primaryAudioOutput;
  const mediaElement = document.getElementById(session.id);
  const remoteStream = new MediaStream();
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
    if (receiver.track.kind === 'audio') {
      remoteStream.addTrack(receiver.track);
    }
  });

  if (mediaElement && typeof mediaElement.sinkId === 'undefined') {
    console.log('safari');
    phoneStore.dispatch({
      type: AUDIO_SINKID_NOT_ALLOWED
    });
    mediaElement.srcObject = remoteStream;
    mediaElement.play();
  } else if (mediaElement && typeof mediaElement.sinkId !== 'undefined') {
    mediaElement.setSinkId(deviceId).then(() => {
      mediaElement.srcObject = remoteStream;
      mediaElement.play();
    });
  } else {
    phoneStore.dispatch({
      type: REMOTE_AUDIO_FAIL
    });
  }

  phoneStore.dispatch({
    type: REMOTE_AUDIO_CONNECTED
  });
};
const setLocalAudio = session => {
  const state = phoneStore.getState();
  const deviceId = state.device.primaryAudioInput;
  session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
    if (sender.track && sender.track.kind === 'audio') {
      let audioDeviceId = deviceId;
      navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: audioDeviceId
        }
      }).then(function (stream) {
        let audioTrack = stream.getAudioTracks();

        if (audioTrack) {
          sender.replaceTrack(audioTrack[0]);
        }
      });
    }
  });
  phoneStore.dispatch({
    type: LOCAL_AUDIO_CONNECTED
  });
};
const cleanupMedia = sessionId => {
  const mediaElement = document.getElementById(sessionId);

  if (mediaElement) {
    mediaElement.srcObject = null;
    mediaElement.pause();
  }
};

const Tone = require('tone');

const DTMF_MATRIX = {
  1: [697, 1209],
  2: [697, 1336],
  3: [697, 1477],
  A: [697, 1633],
  4: [770, 1209],
  5: [770, 1336],
  6: [770, 1477],
  B: [770, 1633],
  7: [852, 1209],
  8: [852, 1336],
  9: [852, 1477],
  C: [852, 1633],
  0: [941, 1209],
  '*': [941, 1336],
  '#': [941, 1477],
  D: [941, 1633]
};
const Synth = Tone.PolySynth && new Tone.PolySynth(2, Tone.Synth);
const FMSynth = Tone.PolySynth && new Tone.PolySynth(2, Tone.FMSynth);
const playDTMF = (key, deviceId) => {
  let obj = DTMF_MATRIX[key];

  if (!obj) {
    console.log('invalid DTMF tone input');
  }

  Synth.volume.value = -22;
  Synth.set({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.2,
      release: 0.02
    }
  });

  if (deviceId !== 'default') {
    const mediaElement = document.getElementById('tone');

    if (mediaElement) {
      let dest = Tone.context.createMediaStreamDestination();
      Synth.connect(dest);
      mediaElement.setSinkId(deviceId).then(() => {
        mediaElement.srcObject = dest.stream;
        mediaElement.play();
      });
    }
  } else {
    Synth.toMaster();
  }

  Synth.triggerAttackRelease(obj, 0.3);
};
const callDisconnect = deviceId => {
  FMSynth.triggerAttack(['C4', 'E4'], '+0.1');
  FMSynth.triggerRelease(['C4', 'E4'], '+0.14');
  FMSynth.triggerAttack(['D4', 'G4'], '+0.14');
  FMSynth.triggerRelease(['D4', 'G4'], '+0.18');

  if (deviceId !== 'default') {
    const mediaElement = document.getElementById('tone');

    if (mediaElement) {
      let dest = Tone.context.createMediaStreamDestination();
      Synth.connect(dest);
      mediaElement.setSinkId(deviceId).then(() => {
        mediaElement.srcObject = dest.stream;
        mediaElement.play();
      });
    }
  } else {
    FMSynth.toMaster();
  }
};

class TonePlayer {
  constructor() {
    this.ringtone = deviceId => {
      const mediaElement = document.getElementById('ringtone');

      if (deviceId !== 'default') {
        if (mediaElement) {
          mediaElement.setSinkId(deviceId).then(() => {
            mediaElement.play();
          });
        } else {
          console.log('no media Element');
        }
      } else {
        mediaElement.play();
      }
    };

    this.ringback = deviceId => {
      let dest = Tone.context.createMediaStreamDestination();
      console.log(dest);
      Synth.set({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.2,
          release: 0.02
        }
      }).connect(dest);

      if (deviceId !== 'default') {
        const mediaElement = document.getElementById('tone');

        if (mediaElement) {
          let _dest = Tone.context.createMediaStreamDestination();

          Synth.connect(_dest);
          mediaElement.setSinkId(deviceId).then(() => {
            mediaElement.srcObject = _dest.stream;
            mediaElement.play();
          });
        }
      } else {
        Synth.toMaster();
      }

      this.loop = new Tone.Loop(time => {
        Synth.triggerAttack([440, 480]);
        Synth.triggerRelease([440, 480], time + 2);
      }, 6);
      this.loop.start(0);
      Tone.Transport.start();
    };
  }

  stop() {
    if (this.loop) {
      try {
        this.loop.stop(0);
      } catch {
        console.log('no loop to stop');
      }
    }

    if (Tone.Transport) {
      try {
        Tone.Transport.stop();
        Synth.triggerRelease([440, 480]);
      } catch {
        console.log('no tone to stop');
      }
    }

    const mediaElement = document.getElementById('ringtone');

    if (mediaElement) {
      const promise = mediaElement.pause();

      if (promise !== undefined) {
        promise.catch(error => {
          console.log(error);
        }).then(() => {
          console.log('ringtone stopped');
        });
      }
    }
  }

}

class ToneManager {
  constructor() {}

  playRing(type) {
    const state = phoneStore.getState();
    const deviceId = state.device.primaryAudioOutput;

    if (this.currentTone) {
      this.currentTone.stop();
      this.currentTone = undefined;
    }

    if (type === 'ringback') {
      this.currentTone = new TonePlayer();
      this.currentTone.ringback(deviceId);
    } else if (type == 'ringtone') {
      this.currentTone = new TonePlayer();
      this.currentTone.ringtone(deviceId);
    }
  }

  stopAll() {
    if (this.currentTone) {
      this.currentTone.stop();
      this.currentTone = undefined;
    }
  }

}

const toneManager = new ToneManager();

class SessionStateHandler {
  constructor(session, ua) {
    this.stateChange = newState => {
      switch (newState) {
        case SessionState.Establishing:
          holdAll(this.session.id);
          toneManager.playRing('ringback');
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          const myTransport = this.ua.transport;
          myTransport.on('message', message => {
            if (message.includes("BYE ") && message.indexOf("BYE ") === 0) {
              if (this.session.state === "Establishing") {
                console.log(message + 'session has recieved a BYE message when the session state is establishing');
                this.session.cancel();
                this.session.dispose();
                setTimeout(() => {
                  phoneStore.dispatch({
                    type: CLOSE_SESSION,
                    payload: this.session.id
                  });
                  toneManager.stopAll();
                  phoneStore.dispatch({
                    type: STRICT_MODE_SHOW_CALL_BUTTON
                  });
                }, 5000);
                return;
              } else {
                return;
              }
            }
          });
          break;

        case SessionState.Established:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          toneManager.stopAll();
          setLocalAudio(this.session);
          setRemoteAudio(this.session);
          break;

        case SessionState.Terminating:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          toneManager.stopAll();
          cleanupMedia(this.session.id);
          break;

        case SessionState.Terminated:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          setTimeout(() => {
            phoneStore.dispatch({
              type: CLOSE_SESSION,
              payload: this.session.id
            });
            toneManager.stopAll();
            phoneStore.dispatch({
              type: STRICT_MODE_SHOW_CALL_BUTTON
            });
          }, 5000);
          break;

        default:
          console.log(`Unknown session state change: ${newState}`);
          break;
      }
    };

    this.session = session;
    this.ua = ua;
  }

}
const getFullNumber = number => {
  if (number.length < 10) {
    return number;
  }

  let fullNumber = `+${phoneStore.getState().sipAccounts.sipAccount._config.defaultCountryCode}${number}`;

  if (number.includes('+') && number.length === 10) {
    fullNumber = `${number}`;
  }

  console.log(fullNumber);
  return fullNumber;
};
const statusMask = status => {
  switch (status) {
    case 'Established':
      return 'Connected';

    case 'Establishing':
      return 'Calling...';

    case 'Initial':
      return 'Initial';

    case 'Terminating':
    case 'Terminated':
      return 'Ended';

    default:
      return 'Unknown Status';
  }
};
const getDurationDisplay = duration => {
  let minutes = Math.floor(duration / 60);
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  let seconds = duration % 60;
  let dh, dm, ds;

  if (hours && hours < 10) {
    dh = `0${hours}:`;
  } else if (hours) {
    dh = `${hours}:`;
  } else {
    dh = '00:';
  }

  if (minutes && minutes < 10) {
    dm = `0${minutes}:`;
  } else if (minutes) {
    dm = `${minutes}:`;
  } else {
    dm = '00:';
  }

  if (seconds && seconds < 10) {
    ds = `0${seconds}`;
  } else if (seconds) {
    ds = `${seconds}`;
  } else {
    ds = '00';
  }

  return `${hours ? dh : ''}${dm}${ds}`;
};

class IncomingSessionStateHandler {
  constructor(incomingSession) {
    this.stateChange = newState => {
      switch (newState) {
        case SessionState.Establishing:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          break;

        case SessionState.Established:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          holdAll(this.incomingSession.id);
          setLocalAudio(this.incomingSession);
          setRemoteAudio(this.incomingSession);
          break;

        case SessionState.Terminating:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          cleanupMedia(this.incomingSession.id);
          break;

        case SessionState.Terminated:
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
          });
          setTimeout(() => {
            phoneStore.dispatch({
              type: CLOSE_SESSION,
              payload: this.incomingSession.id
            });
          }, 5000);
          break;

        default:
          console.log(`Unknown session state change: ${newState}`);
          break;
      }
    };

    this.incomingSession = incomingSession;
  }

}

class SIPAccount {
  constructor(sipConfig, sipCredentials) {
    this._config = sipConfig;
    this._credentials = sipCredentials;
    const uri = UserAgent.makeURI('sip:' + sipCredentials.sipuri);

    if (!uri) {
      throw new Error('Failed to create URI');
    }

    const transportOptions = {
      server: sipConfig.websocket
    };
    const userAgentOptions = {
      autoStart: false,
      autoStop: true,
      noAnswerTimeout: sipConfig.noAnswerTimeout || 30,
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
      authorizationPassword: sipCredentials.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions,
      uri,
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: {
            deviceId: 'default'
          },
          video: false
        },
        alwaysAcquireMediaFirst: true,
        iceCheckingTimeout: 500
      }
    };
    const registererOptions = {
      expires: 300,
      logConfiguration: process.env.NODE_ENV !== 'production'
    };
    this._userAgent = new UserAgent(userAgentOptions);
    this._registerer = new Registerer(this._userAgent, registererOptions);
    this.setupDelegate();

    this._userAgent.start().then(() => {
      this._registerer.register();

      this.setupRegistererListener();
      phoneStore.dispatch({
        type: NEW_USERAGENT,
        payload: this._userAgent
      });
    });
  }

  setupDelegate() {
    this._userAgent.delegate = {
      onInvite(invitation) {
        const incomingSession = invitation;
        incomingSession.delegate = {
          onRefer(referral) {
            console.log(referral);
          }

        };
        phoneStore.dispatch({
          type: INCOMING_CALL,
          payload: incomingSession
        });
        const stateHandler = new IncomingSessionStateHandler(incomingSession);
        incomingSession.stateChange.addListener(stateHandler.stateChange);
      }

    };
  }

  setupRegistererListener() {
    this._registerer.stateChange.addListener(newState => {
      switch (newState) {
        case RegistererState.Initial:
          console.log('The user registration has initialized  ');
          break;

        case RegistererState.Registered:
          console.log('The user is registered ');
          break;

        case RegistererState.Unregistered:
          console.log('The user is unregistered ');
          break;

        case RegistererState.Terminated:
          console.log('The user is terminated ');
          break;
      }
    });
  }

  makeCall(number) {
    let state = phoneStore.getState();
    let sessionsLimit = state.config.phoneConfig.sessionsLimit;
    let sessionsActiveObject = state.sipSessions.sessions;
    let strictMode = state.config.appConfig.mode;
    let attendedTransfersActive = state.sipSessions.attendedTransfers.length;
    let sessionsActive = Object.keys(sessionsActiveObject).length;
    let sessionDiff = sessionsActive - attendedTransfersActive;

    if (sessionDiff >= sessionsLimit) {
      phoneStore.dispatch({
        type: SESSIONS_LIMIT_REACHED
      });
    } else {
      const target = UserAgent.makeURI(`sip:${getFullNumber(number)}@${this._credentials.sipuri.split('@')[1]};user=phone`);

      if (strictMode === 'strict') {
        phoneStore.dispatch({
          type: STRICT_MODE_HIDE_CALL_BUTTON
        });
      }

      if (target) {
        console.log(`Calling ${number}`);
        const inviter = new Inviter(this._userAgent, target);
        const outgoingSession = inviter;
        outgoingSession.delegate = {
          onRefer(referral) {
            console.log('Referred: ' + referral);
          }

        };
        phoneStore.dispatch({
          type: NEW_SESSION,
          payload: outgoingSession
        });
        const stateHandler = new SessionStateHandler(outgoingSession, this._userAgent);
        outgoingSession.stateChange.addListener(stateHandler.stateChange);
        outgoingSession.invite().then(() => {
          console.log('Invite sent!');
        }).catch(error => {
          console.log(error);
        });
      } else {
        console.log(`Failed to establish session for outgoing call to ${number}`);
      }
    }
  }

  listener() {}

}

class SipWrapper extends Component {
  componentDidMount() {
    console.log('mounted');

    if (this.props.sipCredentials.password) {
      this.initializeSip();
    }
  }

  initializeSip() {
    const account = new SIPAccount(this.props.sipConfig, this.props.sipCredentials);
    this.props.setNewAccount(account);
    this.props.setPhoneConfig(this.props.phoneConfig);
    this.props.setAppConfig(this.props.appConfig);
  }

  render() {
    return createElement(Fragment, null, this.props.children);
  }

}

const mapStateToProps = () => ({});

const actions = {
  setNewAccount,
  setPhoneConfig,
  setCredentials,
  setAppConfig
};
var SipWrapper$1 = connect(mapStateToProps, actions)(SipWrapper);

var styles$1 = {"container":"_Status__container__Adysl","incoming":"_Status__incoming__14y58","dialpad":"_Status__dialpad__24i7u","closed":"_Status__closed__3nIZK","statusLarge":"_Status__statusLarge__3G14Z","dialpadButton":"_Status__dialpadButton__38DZj","dialpadButtonLetters":"_Status__dialpadButtonLetters__N-jqm","dialpadRow":"_Status__dialpadRow__19SxG","actionButton":"_Status__actionButton__1hhhF","on":"_Status__on__3ZwLv","endCallButton":"_Status__endCallButton__3z8u3","startCallButton":"_Status__startCallButton__3UW76","actionsContainer":"_Status__actionsContainer__2kDeL","actionsContainerStrict":"_Status__actionsContainerStrict__3WwIv","transferMenu":"_Status__transferMenu__1yjIy","transferInput":"_Status__transferInput__2tho8","transferButtons":"_Status__transferButtons__Rc_m0","userString":"_Status__userString__gelBY","userStringLarge":"_Status__userStringLarge__rgh4W","settingsButton":"_Status__settingsButton__3TfJl","settingsMenu":"_Status__settingsMenu__6JtnT","dropdowns":"_Status__dropdowns__2FMhO","dropdownRow":"_Status__dropdownRow__2NuIJ","dropdownIcon":"_Status__dropdownIcon__1K5Gw"};

var settingsIcon = require("./settings-24px~HQuidduc.svg");

var micIcon = require("./mic-24px~xExSpqQP.svg");

var soundIcon = require("./volume_up-24px~qJQJhpOr.svg");

class Status extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      settingsMenu: false
    };
  }

  componentDidMount() {
    this.props.getInputAudioDevices();
    this.props.getOutputAudioDevices();
  }

  mapOptions(options) {
    const list = [];
    options.map(option => {
      list.push({
        value: option.deviceId,
        label: option.label
      });
    });
    return list;
  }

  handleChangeDevice(type, id) {
    if (type === 'out') {
      this.props.setPrimaryOutput(id, this.props.sessions);
    } else {
      this.props.setPrimaryInput(id, this.props.sessions, this.props.sinkIdAllowed);
    }
  }

  render() {
    const {
      props,
      state
    } = this;
    const inputs = this.mapOptions(props.inputs);
    const outputs = this.mapOptions(props.outputs);
    return createElement(Fragment, null, createElement("div", {
      className: styles$1.container
    }, props.appConfig.appSize === 'large' ? createElement("div", {
      className: styles$1.userStringLarge
    }, props.name) : createElement("div", {
      className: styles$1.userString
    }, props.name), props.phoneConfig.disabledFeatures.includes('settings') ? null : createElement("div", {
      id: styles$1.settingsButton,
      className: state.settingsMenu ? styles$1.on : '',
      onClick: () => this.setState({
        settingsMenu: !state.settingsMenu
      })
    }, createElement("img", {
      src: settingsIcon
    }))), props.phoneConfig.disabledFeatures.includes('settings') ? null : createElement("div", {
      id: styles$1.settingsMenu,
      className: state.settingsMenu ? '' : styles$1.closed
    }, createElement("hr", {
      style: {
        width: '100%'
      }
    }), createElement("div", {
      className: styles$1.dropdownRow
    }, createElement("img", {
      className: styles$1.dropdownIcon,
      src: soundIcon
    }), createElement(Select, {
      placeholder: "Select Output...",
      value: outputs.find(output => output.value === props.primaryOutput) || null,
      onChange: option => this.handleChangeDevice('out', option.value),
      options: outputs,
      id: styles$1.dropdowns
    })), createElement("div", {
      className: styles$1.dropdownRow
    }, createElement("img", {
      className: styles$1.dropdownIcon,
      src: micIcon
    }), createElement(Select, {
      placeholder: "Select Input...",
      value: inputs.find(input => input.value === props.primaryInput),
      onChange: option => this.handleChangeDevice('in', option.value),
      options: inputs,
      id: styles$1.dropdowns
    })), createElement("hr", {
      style: {
        width: '100%'
      }
    })));
  }

}

const mapStateToProps$1 = state => ({
  inputs: state.device.audioInput,
  outputs: state.device.audioOutput,
  primaryInput: state.device.primaryAudioInput,
  primaryOutput: state.device.primaryAudioOutput,
  sessions: state.sipSessions.sessions,
  sinkIdAllowed: state.device.sinkId
});

const actions$1 = {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices
};
var Status$1 = connect(mapStateToProps$1, actions$1)(Status);

var styles$2 = {"container":"_Phone__container__33s4p","incoming":"_Phone__incoming__3dASG","dialpad":"_Phone__dialpad__-iUpI","closed":"_Phone__closed__1Yn0M","statusLarge":"_Phone__statusLarge__3n9O3","dialpadButton":"_Phone__dialpadButton__2Mev0","dialpadButtonLetters":"_Phone__dialpadButtonLetters__30C7x","dialpadRow":"_Phone__dialpadRow__ftZ8R","actionButton":"_Phone__actionButton__1gnBl","on":"_Phone__on__11LDZ","endCallButton":"_Phone__endCallButton__EoCL2","startCallButton":"_Phone__startCallButton__PaJuy","actionsContainer":"_Phone__actionsContainer__25gV2","actionsContainerStrict":"_Phone__actionsContainerStrict__2yCVl","transferMenu":"_Phone__transferMenu__1yYD-","transferInput":"_Phone__transferInput__ovMXl","transferButtons":"_Phone__transferButtons__1-bn8"};

const DialButton = ({
  text,
  click,
  letters
}) => {
  return createElement("div", {
    id: "sip-dial-button",
    className: styles$2.dialpadButton,
    onClick: () => click()
  }, text, createElement("div", {
    style: {
      opacity: letters === '1' ? 0 : 1
    },
    className: styles$2.dialpadButtonLetters
  }, letters));
};

const getButtonLetters = value => {
  switch (value) {
    case '1':
      return '1';

    case '2':
      return 'ABC';

    case '3':
      return 'DEF';

    case '4':
      return 'GHI';

    case '5':
      return 'JKL';

    case '6':
      return 'MNO';

    case '7':
      return 'PQRS';

    case '8':
      return 'TUV';

    case '9':
      return 'WXYZ';

    case '0':
      return '+';

    default:
      return '';
  }
};

class Dialpad extends Component {
  constructor(props) {
    super(props);
    this.topRow = [];
    this.middleRow = [];
    this.bottomRow = [];

    for (let x = 1; x < 4; x++) {
      this.topRow.push(this.getButton(x.toString()));
    }

    for (let x = 4; x < 7; x++) {
      this.middleRow.push(this.getButton(x.toString()));
    }

    for (let x = 7; x < 10; x++) {
      this.bottomRow.push(this.getButton(x.toString()));
    }
  }

  getButton(value) {
    return createElement(DialButton, {
      key: value,
      text: value,
      letters: getButtonLetters(value),
      click: () => this.handleClick(value)
    });
  }

  handleClick(value) {
    if (this.props.session.state === SessionState.Established) {
      this.sendDTMF(value);
      playDTMF(value, this.props.deviceId);
    }
  }

  sendDTMF(value) {
    const options = {
      requestOptions: {
        body: {
          contentDisposition: 'render',
          contentType: 'application/dtmf-relay',
          content: `Signal=${value}\r\nDuration=1000`
        }
      }
    };
    this.props.session.info(options);
  }

  render() {
    return createElement("div", {
      className: this.props.open ? '' : styles$2.closed,
      id: styles$2.dialpad
    }, createElement("div", {
      className: styles$2.dialpadRow
    }, this.topRow), createElement("div", {
      className: styles$2.dialpadRow
    }, this.middleRow), createElement("div", {
      className: styles$2.dialpadRow
    }, this.bottomRow), createElement("div", {
      className: styles$2.dialpadRow
    }, this.getButton('*'), this.getButton('0'), this.getButton('#')));
  }

}

const mapStateToProps$2 = state => ({
  deviceId: state.device.primaryAudioOutput
});

const actions$2 = {};
var Dialpad$1 = connect(mapStateToProps$2, actions$2)(Dialpad);

var holdIcon = require("./phone_paused-24px~TWxpQtZf.svg");

class Hold extends Component {
  hold() {
    if (this.checkHoldState()) {
      this.props.unHoldCallRequest(this.props.session, this.props.onHold, this.props.sessions);
    } else {
      this.props.holdCallRequest(this.props.session);
    }

    return;
  }

  checkHoldState() {
    return this.props.onHold.includes(this.props.session.id);
  }

  render() {
    return createElement("button", {
      className: this.checkHoldState() ? styles$2.on : '',
      id: styles$2.actionButton,
      onClick: () => this.hold()
    }, createElement("img", {
      src: holdIcon
    }));
  }

}

const mapStateToProps$3 = state => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  onHold: state.sipSessions.onHold
});

const actions$3 = {
  holdCallRequest,
  unHoldCallRequest
};
var Hold$1 = connect(mapStateToProps$3, actions$3)(Hold);

var micOffIcon = require("./mic_off-24px~bjejwOqd.svg");

class Mute extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      onMute: false
    };
  }

  mute() {
    if (this.state.onMute) {
      this.props.unMuteRequest();
      return new Promise((resolve, reject) => {
        if (!this.props.session.sessionDescriptionHandler || this.props.session.state !== SessionState.Established) {
          this.props.unMuteFail();
          reject('No session to mute');
          return;
        }

        try {
          const pc = this.props.session.sessionDescriptionHandler.peerConnection;
          pc.getSenders().forEach(function (stream) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = true;
            }
          });
          this.props.unMuteSuccess();
          this.setState({
            onMute: false
          });
          resolve();
          return;
        } catch (err) {
          this.props.unMuteFail();
          reject(err);
          return;
        }
      });
    }

    if (!this.state.onMute) {
      return new Promise((resolve, reject) => {
        if (!this.props.session.sessionDescriptionHandler || this.props.session.state !== SessionState.Established) {
          this.props.muteFail();
          reject('No session to mute');
          return;
        }

        try {
          this.props.muteRequest();
          const pc = this.props.session.sessionDescriptionHandler.peerConnection;
          console.log(pc.getSenders());
          pc.getSenders().forEach(function (stream) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = false;
            }
          });
          this.props.muteSuccess();
          this.setState({
            onMute: true
          });
          resolve();
          return;
        } catch (err) {
          this.props.muteFail();
          reject(err);
          return;
        }
      });
    }

    this.props.muteFail();
    return;
  }

  render() {
    return createElement("div", {
      className: this.state.onMute ? styles$2.on : '',
      id: styles$2.actionButton,
      onClick: () => this.mute()
    }, createElement("img", {
      src: micOffIcon
    }));
  }

}

const mapStateToProps$4 = state => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
});

const actions$4 = {
  muteRequest,
  muteSuccess,
  muteFail,
  unMuteRequest,
  unMuteSuccess,
  unMuteFail
};
var Mute$1 = connect(mapStateToProps$4, actions$4)(Mute);

var transferIcon = require("./arrow_forward-24px~UJhdZXVe.svg");

class BlindTransfer extends Component {
  blindTransferCall() {
    this.props.blindTransferRequest();
    const target = UserAgent.makeURI(`sip:${getFullNumber(this.props.destination)}@${this.props.sipAccount._credentials.sipuri.split('@')[1]};user=phone`);

    if (target) {
      try {
        this.props.session.refer(target);
        this.props.blindTransferSuccess();
      } catch (err) {
        console.log(err);
      }
    } else {
      this.props.blindTransferFail();
    }
  }

  render() {
    return createElement(Fragment, null, createElement("button", {
      className: styles$2.transferButtons,
      onClick: () => this.blindTransferCall()
    }, createElement("img", {
      src: transferIcon
    })));
  }

}

const mapStateToProps$5 = state => ({
  sipAccount: state.sipAccounts.sipAccount,
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
});

const actions$5 = {
  blindTransferRequest,
  blindTransferSuccess,
  blindTransferFail
};
var BlindTranfer = connect(mapStateToProps$5, actions$5)(BlindTransfer);

var attendedIcon = require("./phone_in_talk-24px~DQfZjkDQ.svg");

var declineIcon = require("./call_end-24px~HrwYCAOf.svg");

class AttendedTransfer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      attendedTransferSessionPending: null,
      attendedTransferSessionReady: null
    };
  }

  attendedTransferCall() {
    if (this.props.attendedTransfersList.length >= this.props.phoneConfig.attendedTransferLimit) {
      this.props.attendedTransferLimitReached();
    } else {
      this.holdAll();
      this.props.attendedTransferRequest();
      const target = UserAgent.makeURI(`sip:${getFullNumber(this.props.destination)}@${this.props.sipAccount._credentials.sipuri.split('@')[1]};user=phone`);

      if (target) {
        const inviter = new Inviter(this.props.userAgent, target);
        const outgoingSession = inviter;
        phoneStore.dispatch({
          type: NEW_ATTENDED_TRANSFER,
          payload: outgoingSession
        });
        this.setState({
          attendedTransferSessionPending: outgoingSession
        });
        outgoingSession.stateChange.addListener(newState => {
          switch (newState) {
            case SessionState.Initial:
            case SessionState.Establishing:
              this.props.stateChange(newState, outgoingSession.id);
              this.props.attendedTransferPending();
              break;

            case SessionState.Established:
              this.setState({
                attendedTransferSessionReady: outgoingSession
              });
              this.props.attendedTransferReady();
              this.setState({
                attendedTransferSessionPending: false
              });
              this.props.stateChange(newState, outgoingSession.id);
              setLocalAudio(outgoingSession);
              setRemoteAudio(outgoingSession);
              break;

            case SessionState.Terminating:
              this.props.stateChange(newState, outgoingSession.id);
              cleanupMedia(outgoingSession.id);
              break;

            case SessionState.Terminated:
              this.props.stateChange(newState, outgoingSession.id);
              this.attendedTransferClear();
              this.props.attendedTransferCancel(outgoingSession);
              setTimeout(() => {
                this.props.closeSession(outgoingSession.id);
              }, 5000);
              break;

            default:
              console.log(`Unknown session state change: ${newState}`);
              break;
          }
        });
        outgoingSession.invite().catch(error => {
          this.props.attendedTransferFail(outgoingSession);
          console.log(error);
        });
      } else {
        console.log('Failed to makeURI');
      }
    }
  }

  attendedTransferClear() {
    this.setState({
      attendedTransferSessionPending: null
    });
    this.setState({
      attendedTransferSessionReady: null
    });
    this.props.started(false);
  }

  connectAttendedTransfer(attendedTransferSession) {
    try {
      this.props.session.refer(attendedTransferSession);
      this.props.attendedTransferSuccess();
      this.setState({
        attendedTransferSessionReady: null
      });
    } catch (err) {
      console.log(err);
    }
  }

  cancelAttendedTransfer(attendedTransferSession) {
    attendedTransferSession.cancel();
    this.props.attendedTransferCancel(attendedTransferSession);
    this.setState({
      attendedTransferSessionPending: null
    });
    this.setState({
      attendedTransferSession: null
    });
  }

  holdAll() {
    const state = phoneStore.getState();
    const onHolds = state.sipSessions.onHold;

    if (this.props.session.id in onHolds === false) {
      try {
        this.props.holdCallRequest(this.props.session);
        return;
      } catch (err) {
        return;
      }
    }
  }

  render() {
    if (this.state.attendedTransferSessionReady) {
      const phoneConfigAttended = {
        disabledButtons: ['numpad', 'transfer'],
        disabledFeatures: [''],
        defaultDial: '',
        sessionsLimit: 0,
        attendedTransferLimit: 0
      };
      return createElement(Fragment, null, createElement(Phone$1, {
        session: this.state.attendedTransferSessionReady,
        phoneConfig: phoneConfigAttended
      }), createElement("button", {
        className: styles$2.transferButtons,
        onClick: () => {
          this.props.started(false);
          this.connectAttendedTransfer(this.state.attendedTransferSessionReady);
        }
      }, createElement("img", {
        src: transferIcon
      })));
    } else if (this.state.attendedTransferSessionPending) {
      return createElement("button", {
        className: styles$2.endCallButton,
        onClick: () => {
          this.props.started(false);
          this.cancelAttendedTransfer(this.state.attendedTransferSessionPending);
        }
      }, createElement("img", {
        src: declineIcon
      }));
    } else {
      return createElement("button", {
        className: styles$2.transferButtons,
        onClick: () => {
          this.props.started(true);
          this.attendedTransferCall();
        }
      }, createElement("img", {
        src: attendedIcon
      }));
    }
  }

}

const mapStateToProps$6 = state => ({
  sipAccount: state.sipAccounts.sipAccount,
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  attendedTransfersList: state.sipSessions.attendedTransfers,
  phoneConfig: state.config.phoneConfig
});

const actions$6 = {
  holdCallRequest,
  attendedTransferRequest,
  attendedTransferCancel,
  attendedTransferReady,
  attendedTransferPending,
  attendedTransferSuccess,
  attendedTransferFail,
  attendedTransferLimitReached,
  stateChange,
  closeSession
};
var AttendedTransfer$1 = connect(mapStateToProps$6, actions$6)(AttendedTransfer);

var dialpadIcon = require("./dialpad-24px~cidqBzRK.svg");

class Phone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialpadOpen: false,
      transferMenu: false,
      ended: false,
      transferDialString: '',
      attendedTransferStarted: false,
      duration: 0,
      counterStarted: false
    };
    this.attendedProcess = this.attendedProcess.bind(this);
  }

  componentDidMount() {
    if (this.props.phoneConfig.disabledButtons.includes('dialpadopen')) {
      this.setState({
        dialpadOpen: true
      });
    }
  }

  componentDidUpdate(newProps) {
    if (newProps.session.state === SessionState.Established && !this.state.counterStarted) {
      this.handleCounter();
    }

    if (newProps.session.state === SessionState.Terminated && this.state.ended === false) {
      this.setState({
        ended: true
      });
    }
  }

  endCall() {
    if (this.props.session.state === SessionState.Established) {
      this.props.session.bye();
    } else if (this.props.session.state === SessionState.Initial || this.props.session.state === SessionState.Establishing) {
      toneManager.stopAll();
      callDisconnect(this.props.deviceId);
      this.props.session.cancel();
    }

    this.setState({
      ended: true
    });
    setTimeout(() => {
      this.props.session.dispose();
      this.props.endCall(this.props.session.id);

      if (this.props.strictMode === 'strict') {
        this.props.setAppConfigStarted();
      }
    }, 5000);
  }

  attendedProcess(bool) {
    this.setState({
      attendedTransferStarted: bool
    });
  }

  handleCounter() {
    if (this.props.session && this.props.session.state !== SessionState.Terminated) {
      if (this.state.counterStarted === false) {
        this.setState({
          counterStarted: true
        });
      }

      setTimeout(() => {
        this.setState({
          duration: this.state.duration + 1
        });
        this.handleCounter();
      }, 1000);
    }
  }

  render() {
    const {
      state,
      props
    } = this;
    let durationDisplay;

    if (props.appSize === 'large') {
      if (this.props.session.state === SessionState.Initial || this.props.session.state === SessionState.Establishing) {
        durationDisplay = null;
      } else {
        durationDisplay = createElement("div", {
          className: styles$2.statusLarge
        }, getDurationDisplay(this.state.duration));
      }
    } else {
      if (this.props.session.state === SessionState.Initial || this.props.session.state === SessionState.Establishing) {
        durationDisplay = null;
      } else {
        durationDisplay = createElement("div", null, getDurationDisplay(this.state.duration));
      }
    }

    return createElement(Fragment, null, createElement("hr", {
      style: {
        width: '100%'
      }
    }), props.phoneConfig.disabledFeatures.includes('remoteid') ? null : createElement("div", null, `${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`, createElement("br", null)), props.appSize === 'large' ? createElement("div", {
      className: styles$2.statusLarge
    }, statusMask(props.session.state)) : createElement("div", null, statusMask(props.session.state)), createElement("br", null), durationDisplay, state.ended ? null : createElement(Fragment, null, createElement(Dialpad$1, {
      open: state.dialpadOpen,
      session: props.session
    }), createElement("div", {
      className: props.strictMode === 'strict' ? styles$2.actionsContainerStrict : styles$2.actionsContainer
    }, props.phoneConfig.disabledButtons.includes('mute') ? null : createElement(Mute$1, {
      session: props.session
    }), createElement("button", {
      className: styles$2.endCallButton,
      disabled: state.ended,
      onClick: () => this.endCall()
    }, createElement("img", {
      src: declineIcon
    })), props.phoneConfig.disabledButtons.includes('hold') ? null : createElement(Hold$1, {
      session: props.session
    }), props.phoneConfig.disabledButtons.includes('numpad') ? null : createElement("div", {
      id: styles$2.actionButton,
      className: state.dialpadOpen ? styles$2.on : '',
      onClick: () => this.setState({
        dialpadOpen: !state.dialpadOpen
      })
    }, createElement("img", {
      src: dialpadIcon
    })), props.phoneConfig.disabledButtons.includes('transfer') ? null : createElement("div", {
      id: styles$2.actionButton,
      className: state.transferMenu ? styles$2.on : '',
      onClick: () => this.setState({
        transferMenu: !state.transferMenu
      })
    }, createElement("img", {
      src: transferIcon
    })), createElement("div", {
      id: styles$2.transferMenu,
      className: state.transferMenu ? '' : styles$2.closed
    }, createElement("input", {
      id: styles$2.transferInput,
      onChange: e => this.setState({
        transferDialString: e.target.value
      }),
      placeholder: "Enter the transfer destination..."
    }), this.state.attendedTransferStarted ? null : createElement(BlindTranfer, {
      destination: state.transferDialString,
      session: props.session
    }), createElement(AttendedTransfer$1, {
      started: this.attendedProcess,
      destination: state.transferDialString,
      session: props.session
    }))), createElement("audio", {
      id: this.props.session.id,
      autoPlay: true
    })));
  }

}

const mapStateToProps$7 = state => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  deviceId: state.device.primaryAudioOutput,
  strictMode: state.config.appConfig.mode,
  appSize: state.config.appConfig.appSize
});

const actions$7 = {
  endCall,
  setAppConfigStarted
};
var Phone$1 = connect(mapStateToProps$7, actions$7)(Phone);

var callIcon = require("./call-24px~AGZUevvA.svg");

const ring = require('./assets/ring.mp3');

class Incoming extends Component {
  componentDidMount() {
    toneManager.stopAll();
    toneManager.playRing('ringtone');
  }

  handleAccept() {
    toneManager.stopAll();
    this.props.session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        }
      }
    });
    this.props.acceptCall(this.props.session);
  }

  handleDecline() {
    toneManager.stopAll();
    this.props.session.reject();
    this.props.declineCall(this.props.session);
  }

  render() {
    const props = this.props;
    return createElement("div", {
      id: styles$2.incoming
    }, `Incoming: ${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`, createElement("div", {
      className: styles$2.endCallButton,
      onClick: () => this.handleDecline()
    }, createElement("img", {
      src: declineIcon
    })), createElement("div", {
      className: styles$2.startCallButton,
      onClick: () => this.handleAccept()
    }, createElement("img", {
      src: callIcon
    })), createElement("audio", {
      id: 'ringtone',
      loop: true
    }, createElement("source", {
      src: ring,
      type: "audio/mpeg"
    })), createElement("audio", {
      id: this.props.session.id
    }));
  }

}

const mapStateToProps$8 = state => ({
  stateChanged: state.sipSessions.stateChanged
});

const actions$8 = {
  acceptCall,
  declineCall
};
var Incoming$1 = connect(mapStateToProps$8, actions$8)(Incoming);

const getSessions = (sessions, phoneConfig, attendedTransfers, incomingCalls) => {
  const elements = [];

  for (const session in sessions) {
    if (attendedTransfers.includes(session)) continue;

    if (incomingCalls.includes(session)) {
      if (Object.keys(sessions).length >= phoneConfig.sessionsLimit + incomingCalls.length) {
        console.log('Unable to create more sessions... please check your phoneConfig options');
      } else {
        elements.push(createElement(Incoming$1, {
          session: sessions[session],
          key: session
        }));
      }
    } else {
      elements.push(createElement(Phone$1, {
        session: sessions[session],
        key: session,
        phoneConfig: phoneConfig
      }));
    }
  }

  return elements;
};

class PhoneSessions extends Component {
  render() {
    return createElement(Fragment, null, getSessions(this.props.sessions, this.props.phoneConfig, this.props.attendedTransfers, this.props.incomingCalls));
  }

}

const mapStateToProps$9 = state => ({
  sessions: state.sipSessions.sessions,
  incomingCalls: state.sipSessions.incomingCalls,
  attendedTransfers: state.sipSessions.attendedTransfers
});

const PS = connect(mapStateToProps$9)(PhoneSessions);

var styles$3 = {"container":"_Dialstring__container__2iAE_","dialButton":"_Dialstring__dialButton__3GsXr","dialButtonStrict":"_Dialstring__dialButtonStrict__tfL15","dialInput":"_Dialstring__dialInput__32AFz","dialstringContainerStrict":"_Dialstring__dialstringContainerStrict__2qSFk","dialstringContainer":"_Dialstring__dialstringContainer__2sye_"};

var callIconLarge = require("./call-large-40px~tyHaARth.svg");

class Dialstring extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      currentDialString: ''
    };
  }

  handleDial() {
    let sessionsActive = Object.keys(this.props.sessions).length;
    let attendedTransferActive = this.props.attendedTransfersList.length;
    let sessionDiff = sessionsActive - attendedTransferActive;

    if (sessionDiff >= this.props.phoneConfig.sessionsLimit) {
      this.props.sessionsLimitReached();
    } else {
      if (this.props.appConfig.mode === 'strict') {
        this.props.sipAccount.makeCall(this.props.phoneConfig.defaultDial);
      }

      if (!this.checkDialstring()) {
        this.props.sipAccount.makeCall(`${this.state.currentDialString}`);
      }
    }
  }

  checkDialstring() {
    return this.state.currentDialString.length === 0;
  }

  render() {
    const {
      props
    } = this;

    if (props.appConfig.mode.includes('strict') && props.started === true) {
      return createElement("div", {
        className: styles$3.dialstringContainerStrict
      }, createElement("button", {
        className: styles$3.dialButtonStrict,
        onClick: () => this.handleDial()
      }, createElement("img", {
        src: callIconLarge
      })));
    } else if (props.appConfig.mode.includes('strict')) {
      return null;
    } else {
      return createElement("div", {
        className: styles$3.dialstringContainer
      }, createElement("input", {
        className: styles$3.dialInput,
        onKeyPress: e => {
          if (e.key === 'Enter') {
            this.handleDial();
            e.preventDefault();
          }
        },
        placeholder: "Enter the number to dial...",
        onChange: e => this.setState({
          currentDialString: e.target.value
        })
      }), createElement("button", {
        className: styles$3.dialButton,
        disabled: this.checkDialstring(),
        onClick: () => this.handleDial()
      }, createElement("img", {
        src: callIcon
      })));
    }
  }

}

const mapStateToProps$a = state => ({
  sipAccount: state.sipAccounts.sipAccount,
  sessions: state.sipSessions.sessions,
  started: state.config.appConfig.started,
  attendedTransfersList: state.sipSessions.attendedTransfers
});

const actions$9 = {
  sessionsLimitReached
};
const D = connect(mapStateToProps$a, actions$9)(Dialstring);

const sipSessions = (state = {
  sessions: {},
  incomingCalls: [],
  stateChanged: 0,
  onHold: [],
  attendedTransfers: []
}, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call');
      return { ...state,
        sessions: { ...state.sessions,
          [payload.id]: payload
        },
        incomingCalls: [...state.incomingCalls, payload.id]
      };

    case NEW_SESSION:
      console.log('New session added');
      return { ...state,
        sessions: { ...state.sessions,
          [payload.id]: payload
        }
      };

    case NEW_ATTENDED_TRANSFER:
      return { ...state,
        sessions: { ...state.sessions,
          [payload.id]: payload
        },
        attendedTransfers: [...state.attendedTransfers, payload.id]
      };

    case SIPSESSION_ATTENDED_TRANSFER_CANCEL:
    case SIPSESSION_ATTENDED_TRANSFER_FAIL:
      const newAttendedTransfers = [...state.attendedTransfers].filter(id => id !== payload.id);
      return { ...state,
        attendedTransfers: newAttendedTransfers
      };

    case ACCEPT_CALL:
      const acceptedIncoming = [...state.incomingCalls].filter(id => id !== payload.id);
      return { ...state,
        incomingCalls: acceptedIncoming
      };

    case DECLINE_CALL:
      const declinedIncoming = [...state.incomingCalls].filter(id => id !== payload.id);
      const declinedSessions = { ...state.sessions
      };
      delete declinedSessions[payload.id];
      return { ...state,
        incomingCalls: declinedIncoming,
        sessions: declinedSessions
      };

    case SIPSESSION_STATECHANGE:
      return { ...state,
        stateChanged: state.stateChanged + 1
      };

    case CLOSE_SESSION:
      const closedIncoming = [...state.incomingCalls].filter(id => id !== payload);
      const newSessions = { ...state.sessions
      };
      delete newSessions[payload];
      const endHold = [...state.onHold].filter(id => id !== payload);
      return { ...state,
        sessions: newSessions,
        incomingCalls: closedIncoming,
        onHold: endHold
      };

    case SIPSESSION_HOLD_REQUEST:
      return { ...state,
        onHold: [...state.onHold, payload]
      };

    case SIPSESSION_UNHOLD_REQUEST:
      const newHold = [...state.onHold].filter(id => id !== payload);
      return { ...state,
        onHold: newHold
      };

    default:
      return state;
  }
};

const sipAccounts = (state = {
  sipAccount: null,
  userAgent: null,
  status: ''
}, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case NEW_ACCOUNT:
      return { ...state,
        sipAccount: action.payload
      };

    case NEW_USERAGENT:
      return { ...state,
        userAgent: payload
      };

    default:
      return state;
  }
};

const device = (state = {
  audioInput: [],
  audioOutput: [],
  primaryAudioOutput: 'default',
  primaryAudioInput: 'default',
  sinkId: true
}, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case AUDIO_INPUT_DEVICES_DETECTED:
      return { ...state,
        audioInput: payload
      };

    case AUDIO_OUTPUT_DEVICES_DETECTED:
      return { ...state,
        audioOutput: payload
      };

    case SET_PRIMARY_OUTPUT:
      return { ...state,
        primaryAudioOutput: payload
      };

    case SET_PRIMARY_INPUT:
      return { ...state,
        primaryAudioInput: payload
      };

    case AUDIO_SINKID_NOT_ALLOWED:
      return { ...state,
        sinkId: false
      };

    default:
      return state;
  }
};

const config = (state = {
  uri: '',
  password: '',
  phoneConfig: {},
  appConfig: {
    mode: '',
    started: false,
    appSize: ''
  }
}, action) => {
  switch (action.type) {
    case SET_PHONE_CONFIG:
      return { ...state,
        phoneConfig: action.payload
      };

    case SET_CREDENTIALS:
      return { ...state,
        uri: action.payload.uri,
        password: action.payload.password
      };

    case SET_APP_CONFIG:
      return { ...state,
        appConfig: action.payload
      };

    case STRICT_MODE_SHOW_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return { ...state,
          appConfig: { ...state.appConfig,
            mode: 'strict',
            started: true
          }
        };
      }

    case STRICT_MODE_HIDE_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return { ...state,
          appConfig: { ...state.appConfig,
            mode: 'strict',
            started: false
          }
        };
      }

    default:
      return state;
  }
};

const reducers = combineReducers({
  sipAccounts,
  sipSessions,
  device,
  config
});

const middleware = [thunk];
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['device']
};
const persistedReducer = persistReducer(persistConfig, reducers);
const defaultStore = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
const persistor = persistStore(defaultStore);

const phoneStore = defaultStore;
const ReactSipPhone = ({
  name,
  width: _width = 300,
  height: _height = 600,
  phoneConfig,
  sipConfig,
  appConfig,
  sipCredentials,
  containerStyle: _containerStyle = {}
}) => {
  return createElement(Provider, {
    store: phoneStore
  }, createElement(PersistGate, {
    loading: null,
    persistor: persistor
  }, createElement(SipWrapper$1, {
    sipConfig: sipConfig,
    sipCredentials: sipCredentials,
    phoneConfig: phoneConfig,
    appConfig: appConfig
  }, createElement("div", {
    className: styles.container,
    style: { ..._containerStyle,
      width: `${_width < 300 ? 300 : _width}px`,
      height: `${_height < 600 ? 600 : _height}px`
    }
  }, createElement(Status$1, {
    phoneConfig: phoneConfig,
    appConfig: appConfig,
    name: name
  }), phoneConfig.disabledFeatures.includes('dialstring') ? null : createElement(D, {
    sipConfig: sipConfig,
    phoneConfig: phoneConfig,
    appConfig: appConfig
  }), createElement(PS, {
    phoneConfig: phoneConfig
  }), createElement("audio", {
    id: 'tone',
    autoPlay: true
  })))));
};

export { ReactSipPhone, phoneStore };
//# sourceMappingURL=index.modern.js.map
