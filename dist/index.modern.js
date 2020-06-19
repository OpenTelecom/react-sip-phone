import { Component, createElement, Fragment } from 'react';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionState, UserAgent, Registerer, RegistererState, Inviter } from 'sip.js';
import Tone from 'tone';
import Select from 'react-select';
import { composeWithDevTools } from 'redux-devtools-extension';
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
const holdCallRequest = session => {
  if (!session.sessionDescriptionHandler || session.state !== SessionState.Established) {
    return {
      type: SIPSESSION_HOLD_FAIL
    };
  }

  try {
    session.invite({
      sessionDescriptionHandlerModifiers: [session.sessionDescriptionHandler.holdModifier]
    });
    return {
      type: SIPSESSION_HOLD_REQUEST,
      payload: session.id
    };
  } catch (err) {
    return {
      type: SIPSESSION_HOLD_FAIL
    };
  }
};
const unHoldCallRequest = (_session, onHolds, sessions) => dispatch => {
  for (let [sessionId, session] of Object.entries(sessions)) {
    if (sessionId in onHolds === false && sessionId !== _session.id) {
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
    }
  }

  try {
    _session.invite();

    dispatch({
      type: SIPSESSION_UNHOLD_REQUEST,
      payload: _session.id
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
const attendedTransferCancel = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_CANCEL
  });
};
const attendedTransferReady = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_READY
  });
};
const attendedTransferPending = () => dispatch => {
  dispatch({
    type: SIPSESSION_ATTENDED_TRANSFER_PENDING
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

const AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED';
const AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED';
const REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED';
const LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED';
const SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT';
const SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT';
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
const setPrimaryOutput = id => {
  return {
    type: SET_PRIMARY_OUTPUT,
    payload: id
  };
};
const setPrimaryInput = id => {
  return {
    type: SET_PRIMARY_INPUT,
    payload: id
  };
};

const setRemoteAudio = session => {
  const state = phoneStore.getState();
  const deviceId = state.device.primaryAudioOutput;
  const mediaElement = document.getElementById(session.id);
  const remoteStream = new MediaStream();
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
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

  phoneStore.dispatch({
    type: REMOTE_AUDIO_CONNECTED
  });
};
const setLocalAudio = session => {
  const state = phoneStore.getState();
  const deviceId = state.device.primaryAudioInput;
  session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
    console.log(sender);

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

    this.stop = () => {
      try {
        this.loop.stop(0);
        Tone.Transport.stop();
        Synth.triggerRelease([440, 480]);
      } catch {
        const mediaElement = document.getElementById('ringtone');
        mediaElement.pause();
      }
    };
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
  constructor(session) {
    this.stateChange = newState => {
      switch (newState) {
        case SessionState.Establishing:
          toneManager.playRing('ringback');
          phoneStore.dispatch({
            type: SIPSESSION_STATECHANGE
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
          toneManager.stopAll();
          setTimeout(() => {
            phoneStore.dispatch({
              type: CLOSE_SESSION,
              payload: this.session.id
            });
          }, 5000);
          break;

        default:
          console.log(`Unknown session state change: ${newState}`);
          break;
      }
    };

    this.session = session;
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
          this.holdAll();
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

  holdAll() {
    const state = phoneStore.getState();
    const onHolds = state.sipSessions.onHold;
    const sessions = state.sipSessions.sessions;

    for (let [sessionId, session] of Object.entries(sessions)) {
      if (sessionId in onHolds === false && sessionId !== this.incomingSession.id) {
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
    const target = UserAgent.makeURI(`sip:${getFullNumber(number)}@sip.reper.io;user=phone`);

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
      const stateHandler = new SessionStateHandler(outgoingSession);
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

const SET_CREDENTIALS = 'SET_CREDENTIALS';
const SET_CONFIG = 'SET_CONFIG';
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
    type: SET_CONFIG,
    payload: config
  };
};

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
  }

  render() {
    return createElement(Fragment, null, this.props.children);
  }

}

const mapStateToProps = () => ({});

const actions = {
  setNewAccount,
  setPhoneConfig,
  setCredentials
};
var SipWrapper$1 = connect(mapStateToProps, actions)(SipWrapper);

var styles$1 = {"container":"_Status__container__Adysl","incoming":"_Status__incoming__14y58","dialpad":"_Status__dialpad__24i7u","closed":"_Status__closed__3nIZK","dialpadButton":"_Status__dialpadButton__38DZj","dialpadButtonLetters":"_Status__dialpadButtonLetters__N-jqm","dialpadRow":"_Status__dialpadRow__19SxG","actionButton":"_Status__actionButton__1hhhF","on":"_Status__on__3ZwLv","endCallButton":"_Status__endCallButton__3z8u3","startCallButton":"_Status__startCallButton__3UW76","actionsContainer":"_Status__actionsContainer__2kDeL","transferMenu":"_Status__transferMenu__1yjIy","transferInput":"_Status__transferInput__2tho8","transferButtons":"_Status__transferButtons__Rc_m0","userString":"_Status__userString__gelBY","settingsButton":"_Status__settingsButton__3TfJl","settingsMenu":"_Status__settingsMenu__6JtnT","dropdowns":"_Status__dropdowns__2FMhO","dropdownRow":"_Status__dropdownRow__2NuIJ","dropdownIcon":"_Status__dropdownIcon__1K5Gw"};

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
      this.props.setPrimaryOutput(id);
    } else {
      this.props.setPrimaryInput(id);
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
    }, createElement("div", {
      className: styles$1.userString
    }, props.name), createElement("div", {
      id: styles$1.settingsButton,
      className: state.settingsMenu ? styles$1.on : '',
      onClick: () => this.setState({
        settingsMenu: !state.settingsMenu
      })
    }, createElement("img", {
      src: settingsIcon
    }))), createElement("div", {
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
  primaryOutput: state.device.primaryAudioOutput
});

const actions$1 = {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices
};
var Status$1 = connect(mapStateToProps$1, actions$1)(Status);

var styles$2 = {"container":"_Phone__container__33s4p","incoming":"_Phone__incoming__3dASG","dialpad":"_Phone__dialpad__-iUpI","closed":"_Phone__closed__1Yn0M","dialpadButton":"_Phone__dialpadButton__2Mev0","dialpadButtonLetters":"_Phone__dialpadButtonLetters__30C7x","dialpadRow":"_Phone__dialpadRow__ftZ8R","actionButton":"_Phone__actionButton__1gnBl","on":"_Phone__on__11LDZ","endCallButton":"_Phone__endCallButton__EoCL2","startCallButton":"_Phone__startCallButton__PaJuy","actionsContainer":"_Phone__actionsContainer__25gV2","transferMenu":"_Phone__transferMenu__1yYD-","transferInput":"_Phone__transferInput__ovMXl","transferButtons":"_Phone__transferButtons__1-bn8"};

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
    const target = UserAgent.makeURI(`sip:${getFullNumber(this.props.destination)}@sip.reper.io;user=phone`);

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
    this.holdAll();
    this.props.attendedTransferRequest();
    const target = UserAgent.makeURI(`sip:${getFullNumber(this.props.destination)}@sip.reper.io;user=phone`);

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
            break;

          case SessionState.Terminating:
            this.props.stateChange(newState, outgoingSession.id);
            break;

          case SessionState.Terminated:
            this.props.stateChange(newState, outgoingSession.id);
            this.attendedTransferClear();
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
        this.props.attendedTransferFail();
        console.log(error);
      });
    } else {
      this.props.attendedTransferFail();
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
    this.props.attendedTransferCancel();
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
      return createElement(Fragment, null, createElement(Phone$1, {
        session: this.state.attendedTransferSessionReady,
        phoneConfig: {
          disabledButtons: ['numpad', 'transfer']
        }
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
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
});

const actions$6 = {
  holdCallRequest,
  attendedTransferRequest,
  attendedTransferCancel,
  attendedTransferReady,
  attendedTransferPending,
  attendedTransferSuccess,
  attendedTransferFail,
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
    return createElement(Fragment, null, createElement("hr", {
      style: {
        width: '100%'
      }
    }), createElement("div", null, `${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`), createElement("br", null), createElement("div", null, statusMask(props.session.state)), createElement("br", null), this.props.session.state === SessionState.Initial || this.props.session.state === SessionState.Establishing ? null : createElement("div", null, getDurationDisplay(this.state.duration)), state.ended ? null : createElement(Fragment, null, createElement(Dialpad$1, {
      open: state.dialpadOpen,
      session: props.session
    }), createElement("div", {
      className: styles$2.actionsContainer
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
  deviceId: state.device.primaryAudioOutput
});

const actions$7 = {
  endCall
};
var Phone$1 = connect(mapStateToProps$7, actions$7)(Phone);

var callIcon = require("./call-24px~AGZUevvA.svg");

const ring = require('./assets/ring.mp3');

class Incoming extends Component {
  componentDidMount() {
    console.log('this is the session');
    console.log(this.props.session);
    toneManager.stopAll();
    toneManager.playRing('ringtone');
  }

  handleAccept() {
    toneManager.stopAll();
    this.props.session.accept();
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
      id: this.props.session.id,
      autoPlay: true
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

const getSessions = (sessions, phoneConfig, attendedTransfers) => {
  const elements = [];

  for (const session in sessions) {
    if (attendedTransfers.includes(session)) continue;
    elements.push(createElement(Phone$1, {
      session: sessions[session],
      key: session,
      phoneConfig: phoneConfig
    }));
  }

  return elements;
};

const getIncomingCallReferrals = sessions => {
  const elements = [];

  for (const session in sessions) {
    elements.push(createElement(Incoming$1, {
      session: sessions[session],
      key: session
    }));
  }

  return elements;
};

class PhoneSessions extends Component {
  render() {
    return createElement(Fragment, null, getIncomingCallReferrals(this.props.incomingCalls), getSessions(this.props.sessions, this.props.phoneConfig, this.props.attendedTransfers));
  }

}

const mapStateToProps$9 = state => ({
  sessions: state.sipSessions.sessions,
  incomingCalls: state.sipSessions.incomingCalls,
  attendedTransfers: state.sipSessions.attendedTransfers
});

const PS = connect(mapStateToProps$9)(PhoneSessions);

var styles$3 = {"container":"_Dialstring__container__2iAE_","dialButton":"_Dialstring__dialButton__3GsXr","dialInput":"_Dialstring__dialInput__32AFz","dialstringContainer":"_Dialstring__dialstringContainer__2sye_"};

class Dialstring extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      currentDialString: ''
    };
  }

  handleDial() {
    if (!this.checkDialstring()) {
      this.props.sipAccount.makeCall(`${this.state.currentDialString}`);
    }
  }

  checkDialstring() {
    return this.state.currentDialString.length === 0;
  }

  render() {
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

const mapStateToProps$a = state => ({
  sipAccount: state.sipAccounts.sipAccount
});

const actions$9 = {};
const D = connect(mapStateToProps$a, actions$9)(Dialstring);

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

const sipSessions = (state = {
  sessions: {},
  incomingCalls: {},
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
        incomingCalls: { ...state.incomingCalls,
          [payload.id]: payload
        }
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

    case ACCEPT_CALL:
      const acceptedIncoming = { ...state.incomingCalls
      };
      delete acceptedIncoming[payload.id];
      return { ...state,
        incomingCalls: acceptedIncoming,
        sessions: { ...state.sessions,
          [payload.id]: payload
        }
      };

    case DECLINE_CALL:
      const declinedIncoming = { ...state.incomingCalls
      };
      delete declinedIncoming[payload.id];
      return { ...state,
        incomingCalls: declinedIncoming
      };

    case SIPSESSION_STATECHANGE:
      return { ...state,
        stateChanged: state.stateChanged + 1
      };

    case CLOSE_SESSION:
      const newIncoming = { ...state.incomingCalls
      };
      const newSessions = { ...state.sessions
      };
      delete newSessions[payload];
      delete newIncoming[payload];
      const endHold = [...state.onHold].filter(session => session !== payload);
      return { ...state,
        sessions: newSessions,
        incomingCalls: newIncoming,
        onHold: endHold
      };

    case SIPSESSION_HOLD_REQUEST:
      return { ...state,
        onHold: [...state.onHold, payload]
      };

    case SIPSESSION_UNHOLD_REQUEST:
      const newHold = [...state.onHold].filter(session => session !== payload);
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
  primaryAudioInput: 'default'
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

    default:
      return state;
  }
};

const config = (state = {
  uri: '',
  password: '',
  phoneConfig: {}
}, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return { ...state,
        phoneConfig: action.payload
      };

    case SET_CREDENTIALS:
      return { ...state,
        uri: action.payload.uri,
        password: action.payload.password
      };

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
  phoneConfig: _phoneConfig = {
    disabledButtons: []
  },
  sipConfig,
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
    phoneConfig: _phoneConfig
  }, createElement("div", {
    className: styles.container,
    style: { ..._containerStyle,
      width: `${_width < 300 ? 300 : _width}px`,
      height: `${_height < 600 ? 600 : _height}px`
    }
  }, createElement(Status$1, {
    name: name
  }), createElement(D, null), createElement(PS, {
    phoneConfig: _phoneConfig
  }), createElement("audio", {
    id: 'tone',
    autoPlay: true
  })))));
};

export { ReactSipPhone, phoneStore };
//# sourceMappingURL=index.modern.js.map
