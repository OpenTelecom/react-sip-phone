import { createElement, Fragment, Component } from 'react';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionState, UserAgent, Registerer, RegistererState, Inviter } from 'sip.js';
import Select from 'react-select';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var styles = {"container":"_1H7C6"};

var NEW_USERAGENT = 'NEW_USERAGENT';
var NEW_ACCOUNT = 'NEW_ACCOUNT';
var setNewAccount = function setNewAccount(account) {
  return {
    type: NEW_ACCOUNT,
    payload: account
  };
};

var NEW_SESSION = 'NEW_SESSION';
var NEW_ATTENDED_TRANSFER = 'NEW_ATTENDED_TRANSFER';
var INCOMING_CALL = 'INCOMING_CALL';
var ACCEPT_CALL = 'ACCEPT_CALL';
var DECLINE_CALL = 'DECLINE_CALL';
var SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE';
var CLOSE_SESSION = 'CLOSE_SESSION';
var SIPSESSION_HOLD_REQUEST = 'SIPSESSION_HOLD_REQUEST';
var SIPSESSION_HOLD_FAIL = 'SIPSESSION_HOLD_FAIL';
var SIPSESSION_UNHOLD_REQUEST = 'SIPSESSION_UNHOLD_REQUEST';
var SIPSESSION_UNHOLD_FAIL = 'SIPSESSION_UNHOLD_FAIL';
var SIPSESSION_MUTE_REQUEST = 'SIPSESSION_MUTE_REQUEST';
var SIPSESSION_MUTE_SUCCESS = 'SIPSESSION_MUTE_SUCCESS';
var SIPSESSION_MUTE_FAIL = 'SIPSESSION_MUTE_FAIL';
var SIPSESSION_UNMUTE_REQUEST = 'SIPSESSION_UNMUTE_REQUEST';
var SIPSESSION_UNMUTE_SUCCESS = 'SIPSESSION_UNMUTE_SUCCESS';
var SIPSESSION_UNMUTE_FAIL = 'SIPSESSION_UNMUTE_FAIL';
var SIPSESSION_BLIND_TRANSFER_REQUEST = 'SIPSESSION_BLIND_TRANSFER_REQUEST';
var SIPSESSION_BLIND_TRANSFER_SUCCESS = 'SIPSESSION_BLIND_TRANSFER_SUCCESS';
var SIPSESSION_BLIND_TRANSFER_FAIL = 'SIPSESSION_BLIND_TRANSFER_FAIL';
var SIPSESSION_ATTENDED_TRANSFER_REQUEST = 'SIPSESSION_ATTENDED_TRANSFER_REQUEST';
var SIPSESSION_ATTENDED_TRANSFER_PENDING = 'SIPSESSION_ATTENDED_TRANSFER_PENDING';
var SIPSESSION_ATTENDED_TRANSFER_READY = 'SIPSESSION_ATTENDED_TRANSFER_READY';
var SIPSESSION_ATTENDED_TRANSFER_CANCEL = 'SIPSESSION_ATTENDED_TRANSFER_CANCEL';
var SIPSESSION_ATTENDED_TRANSFER_FAIL = 'SIPSESSION_ATTENDED_TRANSFER_FAIL';
var SIPSESSION_ATTENDED_TRANSFER_SUCCESS = 'SIPSESSION_ATTENDED_TRANSFER_SUCCESS';
var stateChange = function stateChange(newState, id) {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_STATECHANGE,
      payload: {
        state: newState,
        id: id
      }
    });
  };
};
var closeSession = function closeSession(id) {
  return function (dispatch) {
    dispatch({
      type: CLOSE_SESSION,
      payload: id
    });
  };
};
var acceptCall = function acceptCall(session) {
  return {
    type: ACCEPT_CALL,
    payload: session
  };
};
var declineCall = function declineCall(session) {
  return {
    type: DECLINE_CALL,
    payload: session
  };
};
var endCall = function endCall(sessionId) {
  return {
    type: CLOSE_SESSION,
    payload: sessionId
  };
};
var holdCallRequest = function holdCallRequest(session) {
  return function (dispatch) {
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
};
var unHoldCallRequest = function unHoldCallRequest(session, onHolds, sessions) {
  return function (dispatch) {
    for (var _i = 0, _Object$entries = Object.entries(sessions); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
          sessionId = _Object$entries$_i[0],
          _session = _Object$entries$_i[1];

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
  };
};
var blindTransferRequest = function blindTransferRequest() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_BLIND_TRANSFER_REQUEST
    });
  };
};
var blindTransferSuccess = function blindTransferSuccess() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_BLIND_TRANSFER_SUCCESS
    });
  };
};
var blindTransferFail = function blindTransferFail() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_BLIND_TRANSFER_FAIL
    });
  };
};
var attendedTransferRequest = function attendedTransferRequest() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_REQUEST
    });
  };
};
var attendedTransferCancel = function attendedTransferCancel(session) {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_CANCEL,
      payload: session
    });
  };
};
var attendedTransferReady = function attendedTransferReady() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_READY
    });
  };
};
var attendedTransferPending = function attendedTransferPending(session) {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_PENDING,
      payload: session
    });
  };
};
var attendedTransferSuccess = function attendedTransferSuccess() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_SUCCESS
    });
  };
};
var attendedTransferFail = function attendedTransferFail() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_FAIL
    });
  };
};
var muteRequest = function muteRequest() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_MUTE_REQUEST
    });
  };
};
var muteSuccess = function muteSuccess() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_MUTE_SUCCESS
    });
  };
};
var muteFail = function muteFail() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_MUTE_FAIL
    });
  };
};
var unMuteRequest = function unMuteRequest() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_UNMUTE_REQUEST
    });
  };
};
var unMuteSuccess = function unMuteSuccess() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_UNMUTE_SUCCESS
    });
  };
};
var unMuteFail = function unMuteFail() {
  return function (dispatch) {
    dispatch({
      type: SIPSESSION_UNMUTE_FAIL
    });
  };
};

var SET_CREDENTIALS = 'SET_CREDENTIALS';
var SET_PHONE_CONFIG = 'SET_PHONE_CONFIG';
var SET_APP_CONFIG = 'SET_APP_CONFIG';
var STRICT_MODE_SHOW_CALL_BUTTON = 'STRICT_MODE_SHOW_CALL_BUTTON';
var STRICT_MODE_HIDE_CALL_BUTTON = 'STRICT_MODE_HIDE_CALL_BUTTON';
var ATTENDED_TRANSFER_LIMIT_REACHED = 'ATTENDED_TRANSFER_LIMIT_REACHED';
var SESSIONS_LIMIT_REACHED = 'SESSIONS_LIMIT_REACHED';
var setCredentials = function setCredentials(uri, password) {
  if (uri === void 0) {
    uri = '';
  }

  if (password === void 0) {
    password = '';
  }

  return {
    type: SET_CREDENTIALS,
    payload: {
      uri: uri,
      password: password
    }
  };
};
var setPhoneConfig = function setPhoneConfig(config) {
  return {
    type: SET_PHONE_CONFIG,
    payload: config
  };
};
var setAppConfig = function setAppConfig(config) {
  return {
    type: SET_APP_CONFIG,
    payload: config
  };
};
var setAppConfigStarted = function setAppConfigStarted() {
  return {
    type: STRICT_MODE_SHOW_CALL_BUTTON
  };
};
var attendedTransferLimitReached = function attendedTransferLimitReached() {
  return {
    type: ATTENDED_TRANSFER_LIMIT_REACHED
  };
};
var sessionsLimitReached = function sessionsLimitReached() {
  return {
    type: SESSIONS_LIMIT_REACHED
  };
};

var holdAll = function holdAll(id) {
  var state = phoneStore.getState();
  var onHolds = state.sipSessions.onHold;
  var sessions = state.sipSessions.sessions;

  for (var _i = 0, _Object$entries = Object.entries(sessions); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
        sessionId = _Object$entries$_i[0],
        session = _Object$entries$_i[1];

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

var AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED';
var AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED';
var REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED';
var REMOTE_AUDIO_FAIL = 'REMOTE_AUDIO_FAIL';
var LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED';
var SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT';
var SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT';
var SET_LOCAL_AUDIO_SESSIONS_PENDING = 'SET_LOCAL_AUDIO_SESSIONS_PENDING';
var SET_LOCAL_AUDIO_SESSION_SUCCESS = 'SET_LOCAL_AUDIO_SESSION_SUCCESS';
var SET_LOCAL_AUDIO_SESSION_FAIL = 'SET_LOCAL_AUDIO_SESSION_FAIL';
var SET_REMOTE_AUDIO_SESSIONS_PENDING = 'SET_REMOTE_AUDIO_SESSIONS_PENDING';
var SET_REMOTE_AUDIO_SESSION_SUCCESS = 'SET_REMOTE_AUDIO_SESSION_SUCCESS';
var SET_REMOTE_AUDIO_SESSION_FAIL = 'SET_REMOTE_AUDIO_SESSION_FAIL';
var AUDIO_SINKID_NOT_ALLOWED = 'AUDIO_SINKID_NOT_ALLOWED';
var getInputAudioDevices = function getInputAudioDevices() {
  var inputArray = [];
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
var getOutputAudioDevices = function getOutputAudioDevices() {
  var outputArray = [];
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
var setPrimaryOutput = function setPrimaryOutput(deviceId, sessions) {
  return function (dispatch) {
    if (sessions) {
      if (Object.keys(sessions).length > 0) {
        dispatch({
          type: SET_REMOTE_AUDIO_SESSIONS_PENDING
        });

        for (var _i = 0, _Object$entries = Object.entries(sessions); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i],
              sessionId = _Object$entries$_i[0],
              _session = _Object$entries$_i[1];

          if (_session.state === 'Established') {
            try {
              (function () {
                var mediaElement = document.getElementById(sessionId);
                var remoteStream = new MediaStream();

                _session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function (receiver) {
                  if (receiver.track) {
                    remoteStream.addTrack(receiver.track);
                  }
                });

                if (mediaElement) {
                  mediaElement.setSinkId(deviceId).then(function () {
                    mediaElement.srcObject = remoteStream;
                    mediaElement.play();
                  });
                } else {
                  console.log('no media Element');
                }
              })();
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
};
var setPrimaryInput = function setPrimaryInput(deviceId, sessions, sinkIdAllowed) {
  return function (dispatch) {
    if (sessions) {
      if (Object.keys(sessions).length > 0) {
        dispatch({
          type: SET_LOCAL_AUDIO_SESSIONS_PENDING
        });

        var _loop = function _loop() {
          var _Object$entries2$_i = _Object$entries2[_i2],
              sessionId = _Object$entries2$_i[0],
              _session = _Object$entries2$_i[1];

          if (_session.state === 'Established') {
            try {
              _session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
                console.log(sessionId);

                if (sender.track && sender.track.kind === 'audio') {
                  var audioDeviceId = deviceId;
                  navigator.mediaDevices.getUserMedia({
                    audio: {
                      deviceId: audioDeviceId
                    }
                  }).then(function (stream) {
                    var audioTrack = stream.getAudioTracks();
                    sender.replaceTrack(audioTrack[0]);
                  });
                }
              });
            } catch (err) {
              console.log(err);
              dispatch({
                type: SET_LOCAL_AUDIO_SESSION_FAIL
              });
              return {
                v: void 0
              };
            }
          }

          dispatch({
            type: SET_LOCAL_AUDIO_SESSION_SUCCESS
          });
        };

        for (var _i2 = 0, _Object$entries2 = Object.entries(sessions); _i2 < _Object$entries2.length; _i2++) {
          var _ret = _loop();

          if (typeof _ret === "object") return _ret.v;
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
          for (var _i3 = 0, _Object$entries3 = Object.entries(sessions); _i3 < _Object$entries3.length; _i3++) {
            var _Object$entries3$_i = _Object$entries3[_i3],
                sessionId = _Object$entries3$_i[0],
                _session = _Object$entries3$_i[1];

            if (_session.state === 'Established') {
              try {
                (function () {
                  var mediaElement = document.getElementById(sessionId);
                  var remoteStream = new MediaStream();

                  _session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function (receiver) {
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
                })();
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
};

var setRemoteAudio = function setRemoteAudio(session) {
  console.log('setRemoteAudio');
  var state = phoneStore.getState();
  var deviceId = state.device.primaryAudioOutput;
  var mediaElement = document.getElementById(session.id);
  var remoteStream = new MediaStream();
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function (receiver) {
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
    mediaElement.setSinkId(deviceId).then(function () {
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
var setLocalAudio = function setLocalAudio(session) {
  var state = phoneStore.getState();
  var deviceId = state.device.primaryAudioInput;
  session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function (sender) {
    if (sender.track && sender.track.kind === 'audio') {
      var audioDeviceId = deviceId;
      navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: audioDeviceId
        }
      }).then(function (stream) {
        var audioTrack = stream.getAudioTracks();

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
var cleanupMedia = function cleanupMedia(sessionId) {
  var mediaElement = document.getElementById(sessionId);

  if (mediaElement) {
    mediaElement.srcObject = null;
    mediaElement.pause();
  }
};

var Tone = require('tone');

var DTMF_MATRIX = {
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
var Synth = Tone.PolySynth && new Tone.PolySynth(2, Tone.Synth);
var FMSynth = Tone.PolySynth && new Tone.PolySynth(2, Tone.FMSynth);
var playDTMF = function playDTMF(key, deviceId) {
  var obj = DTMF_MATRIX[key];

  if (!obj) {
    console.log('invalid DTMF tone input');
  }

  Synth.volume.value = -10;
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
    var mediaElement = document.getElementById('tone');

    if (mediaElement) {
      var dest = Tone.context.createMediaStreamDestination();
      Synth.connect(dest);
      mediaElement.setSinkId(deviceId).then(function () {
        mediaElement.srcObject = dest.stream;
        mediaElement.play();
      });
    }
  } else {
    Synth.toMaster();
  }

  Synth.triggerAttackRelease(obj, 0.3);
};
var callDisconnect = function callDisconnect(deviceId) {
  FMSynth.triggerAttack(['C4', 'E4'], '+0.1');
  FMSynth.triggerRelease(['C4', 'E4'], '+0.14');
  FMSynth.triggerAttack(['D4', 'G4'], '+0.14');
  FMSynth.triggerRelease(['D4', 'G4'], '+0.18');

  if (deviceId !== 'default') {
    var mediaElement = document.getElementById('tone');

    if (mediaElement) {
      var dest = Tone.context.createMediaStreamDestination();
      Synth.connect(dest);
      mediaElement.setSinkId(deviceId).then(function () {
        mediaElement.srcObject = dest.stream;
        mediaElement.play();
      });
    }
  } else {
    FMSynth.toMaster();
  }
};

var TonePlayer = /*#__PURE__*/function () {
  function TonePlayer() {
    var _this = this;

    this.ringtone = function (deviceId) {
      var mediaElement = document.getElementById('ringtone');

      if (deviceId !== 'default') {
        if (mediaElement) {
          mediaElement.setSinkId(deviceId).then(function () {
            mediaElement.play();
          });
        } else {
          console.log('no media Element');
        }
      } else {
        mediaElement.play();
      }
    };

    this.ringback = function (deviceId) {
      var dest = Tone.context.createMediaStreamDestination();
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
        var mediaElement = document.getElementById('tone');

        if (mediaElement) {
          var _dest = Tone.context.createMediaStreamDestination();

          Synth.connect(_dest);
          mediaElement.setSinkId(deviceId).then(function () {
            mediaElement.srcObject = _dest.stream;
            mediaElement.play();
          });
        }
      } else {
        Synth.toMaster();
      }

      _this.loop = new Tone.Loop(function (time) {
        Synth.triggerAttack([440, 480]);
        Synth.triggerRelease([440, 480], time + 2);
      }, 6);

      _this.loop.start(0);

      Tone.Transport.start();
    };
  }

  var _proto = TonePlayer.prototype;

  _proto.stop = function stop() {
    if (this.loop) {
      try {
        this.loop.stop(0);
      } catch (_unused) {
        console.log('no loop to stop');
      }
    }

    if (Tone.Transport) {
      try {
        Tone.Transport.stop();
        Synth.triggerRelease([440, 480]);
      } catch (_unused2) {
        console.log('no tone to stop');
      }
    }

    var mediaElement = document.getElementById('ringtone');

    if (mediaElement) {
      var promise = mediaElement.pause();

      if (promise !== undefined) {
        promise["catch"](function (error) {
          console.log(error);
        }).then(function () {
          console.log('ringtone stopped');
        });
      }
    }
  };

  return TonePlayer;
}();

var ToneManager = /*#__PURE__*/function () {
  function ToneManager() {}

  var _proto = ToneManager.prototype;

  _proto.playRing = function playRing(type) {
    var state = phoneStore.getState();
    var deviceId = state.device.primaryAudioOutput;

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
  };

  _proto.stopAll = function stopAll() {
    if (this.currentTone) {
      this.currentTone.stop();
      this.currentTone = undefined;
    }
  };

  return ToneManager;
}();

var toneManager = new ToneManager();

var SessionStateHandler = function SessionStateHandler(session, ua) {
  var _this = this;

  this.stateChange = function (newState) {
    switch (newState) {
      case SessionState.Establishing:
        holdAll(_this.session.id);
        toneManager.playRing('ringback');
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        var myTransport = _this.ua.transport;
        myTransport.on('message', function (message) {
          if (message.includes('BYE ') && message.indexOf('BYE ') === 0) {
            if (_this.session.state === 'Establishing') {
              console.log(message + " session has recieved a BYE message when the session state is establishing");

              _this.session.cancel();

              _this.session.dispose();

              setTimeout(function () {
                phoneStore.dispatch({
                  type: CLOSE_SESSION,
                  payload: _this.session.id
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
        setLocalAudio(_this.session);
        setRemoteAudio(_this.session);
        break;

      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        toneManager.stopAll();
        cleanupMedia(_this.session.id);
        break;

      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        setTimeout(function () {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: _this.session.id
          });
          toneManager.stopAll();
          phoneStore.dispatch({
            type: STRICT_MODE_SHOW_CALL_BUTTON
          });
        }, 5000);
        break;

      default:
        console.log("Unknown session state change: " + newState);
        break;
    }
  };

  this.session = session;
  this.ua = ua;
};
var getFullNumber = function getFullNumber(number) {
  if (number.length < 10) {
    return number;
  }

  var fullNumber = "+" + phoneStore.getState().sipAccounts.sipAccount._config.defaultCountryCode + number;

  if (number.includes('+') && number.length === 10) {
    fullNumber = "" + number;
  }

  console.log(fullNumber);
  return fullNumber;
};
var statusMask = function statusMask(status) {
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
var getDurationDisplay = function getDurationDisplay(duration) {
  var minutes = Math.floor(duration / 60);
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  var seconds = duration % 60;
  var dh, dm, ds;

  if (hours && hours < 10) {
    dh = "0" + hours + ":";
  } else if (hours) {
    dh = hours + ":";
  } else {
    dh = '00:';
  }

  if (minutes && minutes < 10) {
    dm = "0" + minutes + ":";
  } else if (minutes) {
    dm = minutes + ":";
  } else {
    dm = '00:';
  }

  if (seconds && seconds < 10) {
    ds = "0" + seconds;
  } else if (seconds) {
    ds = "" + seconds;
  } else {
    ds = '00';
  }

  return "" + (hours ? dh : '') + dm + ds;
};

var IncomingSessionStateHandler = function IncomingSessionStateHandler(incomingSession) {
  var _this = this;

  this.stateChange = function (newState) {
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
        holdAll(_this.incomingSession.id);
        setLocalAudio(_this.incomingSession);
        setRemoteAudio(_this.incomingSession);
        break;

      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        cleanupMedia(_this.incomingSession.id);
        break;

      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        });
        setTimeout(function () {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: _this.incomingSession.id
          });
        }, 5000);
        break;

      default:
        console.log("Unknown session state change: " + newState);
        break;
    }
  };

  this.incomingSession = incomingSession;
};

var SIPAccount = /*#__PURE__*/function () {
  function SIPAccount(sipConfig, sipCredentials) {
    var _this = this;

    this._config = sipConfig;
    this._credentials = sipCredentials;
    var uri = UserAgent.makeURI('sip:' + sipCredentials.sipuri);

    if (!uri) {
      throw new Error('Failed to create URI');
    }

    var transportOptions = {
      server: sipConfig.websocket
    };
    var userAgentOptions = {
      autoStart: false,
      autoStop: true,
      noAnswerTimeout: sipConfig.noAnswerTimeout || 30,
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
      authorizationPassword: sipCredentials.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions: transportOptions,
      uri: uri,
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
    var registererOptions = {
      expires: 300,
      logConfiguration: process.env.NODE_ENV !== 'production'
    };
    this._userAgent = new UserAgent(userAgentOptions);
    this._registerer = new Registerer(this._userAgent, registererOptions);
    this.setupDelegate();

    this._userAgent.start().then(function () {
      _this._registerer.register();

      _this.setupRegistererListener();

      phoneStore.dispatch({
        type: NEW_USERAGENT,
        payload: _this._userAgent
      });
    });
  }

  var _proto = SIPAccount.prototype;

  _proto.setupDelegate = function setupDelegate() {
    this._userAgent.delegate = {
      onInvite: function onInvite(invitation) {
        var incomingSession = invitation;
        incomingSession.delegate = {
          onRefer: function onRefer(referral) {
            console.log(referral);
          }
        };
        phoneStore.dispatch({
          type: INCOMING_CALL,
          payload: incomingSession
        });
        var stateHandler = new IncomingSessionStateHandler(incomingSession);
        incomingSession.stateChange.addListener(stateHandler.stateChange);
      }
    };
  };

  _proto.setupRegistererListener = function setupRegistererListener() {
    this._registerer.stateChange.addListener(function (newState) {
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
  };

  _proto.makeCall = function makeCall(number) {
    var state = phoneStore.getState();
    var sessionsLimit = state.config.phoneConfig.sessionsLimit;
    var sessionsActiveObject = state.sipSessions.sessions;
    var strictMode = state.config.appConfig.mode;
    var attendedTransfersActive = state.sipSessions.attendedTransfers.length;
    var sessionsActive = Object.keys(sessionsActiveObject).length;
    var sessionDiff = sessionsActive - attendedTransfersActive;

    if (sessionDiff >= sessionsLimit) {
      phoneStore.dispatch({
        type: SESSIONS_LIMIT_REACHED
      });
    } else {
      var target = UserAgent.makeURI("sip:" + getFullNumber(number) + "@" + this._credentials.sipuri.split('@')[1] + ";user=phone");

      if (strictMode === 'strict') {
        phoneStore.dispatch({
          type: STRICT_MODE_HIDE_CALL_BUTTON
        });
      }

      if (target) {
        console.log("Calling " + number);
        var inviter = new Inviter(this._userAgent, target);
        var outgoingSession = inviter;
        outgoingSession.delegate = {
          onRefer: function onRefer(referral) {
            console.log('Referred: ' + referral);
          }
        };
        phoneStore.dispatch({
          type: NEW_SESSION,
          payload: outgoingSession
        });
        var stateHandler = new SessionStateHandler(outgoingSession, this._userAgent);
        outgoingSession.stateChange.addListener(stateHandler.stateChange);
        outgoingSession.invite().then(function () {
          console.log('Invite sent!');
        })["catch"](function (error) {
          console.log(error);
        });
      } else {
        console.log("Failed to establish outgoing call session to " + number);
      }
    }
  };

  _proto.listener = function listener() {};

  return SIPAccount;
}();

var SipWrapper = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(SipWrapper, _React$Component);

  function SipWrapper() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = SipWrapper.prototype;

  _proto.componentDidMount = function componentDidMount() {
    console.log('mounted');

    if (this.props.sipCredentials.password) {
      this.initializeSip();
    }
  };

  _proto.initializeSip = function initializeSip() {
    var account = new SIPAccount(this.props.sipConfig, this.props.sipCredentials);
    this.props.setNewAccount(account);
    this.props.setPhoneConfig(this.props.phoneConfig);
    this.props.setAppConfig(this.props.appConfig);
  };

  _proto.render = function render() {
    return createElement(Fragment, null, this.props.children);
  };

  return SipWrapper;
}(Component);

var mapStateToProps = function mapStateToProps() {
  return {};
};

var actions = {
  setNewAccount: setNewAccount,
  setPhoneConfig: setPhoneConfig,
  setCredentials: setCredentials,
  setAppConfig: setAppConfig
};
var SipWrapper$1 = connect(mapStateToProps, actions)(SipWrapper);

var styles$1 = {"container":"_Adysl","incoming":"_14y58","dialpad":"_24i7u","closed":"_3nIZK","statusLarge":"_3G14Z","dialpadButton":"_38DZj","dialpadButtonLetters":"_N-jqm","dialpadRow":"_19SxG","actionButton":"_1hhhF","on":"_3ZwLv","endCallButton":"_3z8u3","startCallButton":"_3UW76","actionsContainer":"_2kDeL","transferMenu":"_1yjIy","transferInput":"_2tho8","transferButtons":"_Rc_m0","userString":"_gelBY","userStringLarge":"_rgh4W","settingsButton":"_3TfJl","settingsMenu":"_6JtnT","dropdowns":"_2FMhO","dropdownRow":"_2NuIJ","dropdownIcon":"_1K5Gw"};

var settingsIcon = require('./assets/settings-24px.svg');

var micIcon = require('./assets/mic-24px.svg');

var soundIcon = require('./assets/volume_up-24px.svg');

var Status = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Status, _React$Component);

  function Status() {
    var _this;

    _this = _React$Component.apply(this, arguments) || this;
    _this.state = {
      settingsMenu: false
    };
    return _this;
  }

  var _proto = Status.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.props.getInputAudioDevices();
    this.props.getOutputAudioDevices();
  };

  _proto.mapOptions = function mapOptions(options) {
    var list = [];
    options.map(function (option) {
      list.push({
        value: option.deviceId,
        label: option.label
      });
    });
    return list;
  };

  _proto.handleChangeDevice = function handleChangeDevice(type, id) {
    if (type === 'out') {
      this.props.setPrimaryOutput(id, this.props.sessions);
    } else {
      this.props.setPrimaryInput(id, this.props.sessions, this.props.sinkIdAllowed);
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var props = this.props,
        state = this.state;
    var inputs = this.mapOptions(props.inputs);
    var outputs = this.mapOptions(props.outputs);
    return createElement(Fragment, null, createElement("div", {
      className: styles$1.container
    }, props.appConfig.appSize === 'large' ? createElement("div", {
      className: styles$1.userStringLarge
    }, props.name) : createElement("div", {
      className: styles$1.userString
    }, props.name), props.phoneConfig.disabledFeatures.includes('settings') ? null : createElement("div", {
      id: styles$1.settingsButton,
      className: state.settingsMenu ? styles$1.on : '',
      onClick: function onClick() {
        return _this2.setState({
          settingsMenu: !state.settingsMenu
        });
      }
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
      placeholder: 'Select Output...',
      value: outputs.find(function (output) {
        return output.value === props.primaryOutput;
      }) || null,
      onChange: function onChange(option) {
        return _this2.handleChangeDevice('out', option.value);
      },
      options: outputs,
      id: styles$1.dropdowns
    })), createElement("div", {
      className: styles$1.dropdownRow
    }, createElement("img", {
      className: styles$1.dropdownIcon,
      src: micIcon
    }), createElement(Select, {
      placeholder: 'Select Input...',
      value: inputs.find(function (input) {
        return input.value === props.primaryInput;
      }),
      onChange: function onChange(option) {
        return _this2.handleChangeDevice('in', option.value);
      },
      options: inputs,
      id: styles$1.dropdowns
    })), createElement("hr", {
      style: {
        width: '100%'
      }
    })));
  };

  return Status;
}(Component);

var mapStateToProps$1 = function mapStateToProps(state) {
  return {
    inputs: state.device.audioInput,
    outputs: state.device.audioOutput,
    primaryInput: state.device.primaryAudioInput,
    primaryOutput: state.device.primaryAudioOutput,
    sessions: state.sipSessions.sessions,
    sinkIdAllowed: state.device.sinkId
  };
};

var actions$1 = {
  setPrimaryInput: setPrimaryInput,
  setPrimaryOutput: setPrimaryOutput,
  getInputAudioDevices: getInputAudioDevices,
  getOutputAudioDevices: getOutputAudioDevices
};
var Status$1 = connect(mapStateToProps$1, actions$1)(Status);

var styles$2 = {"container":"_33s4p","incoming":"_3dASG","dialpad":"_-iUpI","closed":"_1Yn0M","statusLarge":"_3n9O3","dialpadButton":"_2Mev0","dialpadButtonLetters":"_30C7x","dialpadRow":"_ftZ8R","actionButton":"_1gnBl","on":"_11LDZ","endCallButton":"_EoCL2","startCallButton":"_PaJuy","actionsContainer":"_25gV2","transferMenu":"_1yYD-","transferInput":"_ovMXl","transferButtons":"_1-bn8"};

var DialButton = function DialButton(_ref) {
  var text = _ref.text,
      click = _ref.click,
      letters = _ref.letters;
  return createElement("div", {
    id: 'sip-dial-button',
    className: styles$2.dialpadButton,
    onClick: function onClick() {
      return click();
    }
  }, text, createElement("div", {
    style: {
      opacity: letters === '1' ? 0 : 1
    },
    className: styles$2.dialpadButtonLetters
  }, letters));
};

var getButtonLetters = function getButtonLetters(value) {
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

var Dialpad = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Dialpad, _React$Component);

  function Dialpad(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.topRow = [];
    _this.middleRow = [];
    _this.bottomRow = [];

    for (var x = 1; x < 4; x++) {
      _this.topRow.push(_this.getButton(x.toString()));
    }

    for (var _x = 4; _x < 7; _x++) {
      _this.middleRow.push(_this.getButton(_x.toString()));
    }

    for (var _x2 = 7; _x2 < 10; _x2++) {
      _this.bottomRow.push(_this.getButton(_x2.toString()));
    }

    return _this;
  }

  var _proto = Dialpad.prototype;

  _proto.getButton = function getButton(value) {
    var _this2 = this;

    return createElement(DialButton, {
      key: value,
      text: value,
      letters: getButtonLetters(value),
      click: function click() {
        return _this2.handleClick(value);
      }
    });
  };

  _proto.handleClick = function handleClick(value) {
    if (this.props.session.state === SessionState.Established) {
      this.sendDTMF(value);
      playDTMF(value, this.props.deviceId);
    }
  };

  _proto.sendDTMF = function sendDTMF(value) {
    var options = {
      requestOptions: {
        body: {
          contentDisposition: 'render',
          contentType: 'application/dtmf-relay',
          content: "Signal=" + value + "\r\nDuration=1000"
        }
      }
    };
    this.props.session.info(options);
  };

  _proto.render = function render() {
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
  };

  return Dialpad;
}(Component);

var mapStateToProps$2 = function mapStateToProps(state) {
  return {
    deviceId: state.device.primaryAudioOutput
  };
};

var actions$2 = {};
var Dialpad$1 = connect(mapStateToProps$2, actions$2)(Dialpad);

var holdIcon = require('./assets/phone_paused-24px.svg');

var Hold = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Hold, _React$Component);

  function Hold() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Hold.prototype;

  _proto.hold = function hold() {
    if (this.checkHoldState()) {
      this.props.unHoldCallRequest(this.props.session, this.props.onHold, this.props.sessions);
    } else {
      this.props.holdCallRequest(this.props.session);
    }
  };

  _proto.checkHoldState = function checkHoldState() {
    return this.props.onHold.includes(this.props.session.id);
  };

  _proto.render = function render() {
    var _this = this;

    return createElement("button", {
      className: this.checkHoldState() ? styles$2.on : '',
      id: styles$2.actionButton,
      onClick: function onClick() {
        return _this.hold();
      }
    }, createElement("img", {
      src: holdIcon
    }));
  };

  return Hold;
}(Component);

var mapStateToProps$3 = function mapStateToProps(state) {
  return {
    stateChanged: state.sipSessions.stateChanged,
    sessions: state.sipSessions.sessions,
    userAgent: state.sipAccounts.userAgent,
    onHold: state.sipSessions.onHold
  };
};

var actions$3 = {
  holdCallRequest: holdCallRequest,
  unHoldCallRequest: unHoldCallRequest
};
var Hold$1 = connect(mapStateToProps$3, actions$3)(Hold);

var micOffIcon = require('./assets/mic_off-24px.svg');

var Mute = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Mute, _React$Component);

  function Mute() {
    var _this;

    _this = _React$Component.apply(this, arguments) || this;
    _this.state = {
      onMute: false
    };
    return _this;
  }

  var _proto = Mute.prototype;

  _proto.mute = function mute() {
    var _this2 = this;

    if (this.state.onMute) {
      this.props.unMuteRequest();
      return new Promise(function (resolve, reject) {
        if (!_this2.props.session.sessionDescriptionHandler || _this2.props.session.state !== SessionState.Established) {
          _this2.props.unMuteFail();

          reject('No session to mute');
          return;
        }

        try {
          var pc = _this2.props.session.sessionDescriptionHandler.peerConnection;
          pc.getSenders().forEach(function (stream) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = true;
            }
          });

          _this2.props.unMuteSuccess();

          _this2.setState({
            onMute: false
          });

          resolve();
          return;
        } catch (err) {
          _this2.props.unMuteFail();

          reject(err);
        }
      });
    }

    if (!this.state.onMute) {
      return new Promise(function (resolve, reject) {
        if (!_this2.props.session.sessionDescriptionHandler || _this2.props.session.state !== SessionState.Established) {
          _this2.props.muteFail();

          reject('No session to mute');
          return;
        }

        try {
          _this2.props.muteRequest();

          var pc = _this2.props.session.sessionDescriptionHandler.peerConnection;
          console.log(pc.getSenders());
          pc.getSenders().forEach(function (stream) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = false;
            }
          });

          _this2.props.muteSuccess();

          _this2.setState({
            onMute: true
          });

          resolve();
          return;
        } catch (err) {
          _this2.props.muteFail();

          reject(err);
          return;
        }
      });
    }

    this.props.muteFail();
    return;
  };

  _proto.render = function render() {
    var _this3 = this;

    return createElement("div", {
      className: this.state.onMute ? styles$2.on : '',
      id: styles$2.actionButton,
      onClick: function onClick() {
        return _this3.mute();
      }
    }, createElement("img", {
      src: micOffIcon
    }));
  };

  return Mute;
}(Component);

var mapStateToProps$4 = function mapStateToProps(state) {
  return {
    stateChanged: state.sipSessions.stateChanged,
    sessions: state.sipSessions.sessions,
    userAgent: state.sipAccounts.userAgent
  };
};

var actions$4 = {
  muteRequest: muteRequest,
  muteSuccess: muteSuccess,
  muteFail: muteFail,
  unMuteRequest: unMuteRequest,
  unMuteSuccess: unMuteSuccess,
  unMuteFail: unMuteFail
};
var Mute$1 = connect(mapStateToProps$4, actions$4)(Mute);

var blindIcon = require('./assets/arrow_forward-24px.svg');

var BlindTransfer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(BlindTransfer, _React$Component);

  function BlindTransfer() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = BlindTransfer.prototype;

  _proto.blindTransferCall = function blindTransferCall() {
    this.props.blindTransferRequest();
    var target = UserAgent.makeURI("sip:" + getFullNumber(this.props.destination) + "@" + this.props.sipAccount._credentials.sipuri.split('@')[1] + ";user=phone");

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
  };

  _proto.render = function render() {
    var _this = this;

    return createElement(Fragment, null, createElement("button", {
      className: styles$2.transferButtons,
      onClick: function onClick() {
        return _this.blindTransferCall();
      }
    }, createElement("img", {
      src: blindIcon
    })));
  };

  return BlindTransfer;
}(Component);

var mapStateToProps$5 = function mapStateToProps(state) {
  return {
    sipAccount: state.sipAccounts.sipAccount,
    stateChanged: state.sipSessions.stateChanged,
    sessions: state.sipSessions.sessions,
    userAgent: state.sipAccounts.userAgent
  };
};

var actions$5 = {
  blindTransferRequest: blindTransferRequest,
  blindTransferSuccess: blindTransferSuccess,
  blindTransferFail: blindTransferFail
};
var BlindTranfer = connect(mapStateToProps$5, actions$5)(BlindTransfer);

var attendedIcon = require('./assets/phone_in_talk-24px.svg');

var cancelIcon = require('./assets/call_end-24px.svg');

var connectIcon = require('./assets/arrow_forward-24px.svg');

var AttendedTransfer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(AttendedTransfer, _React$Component);

  function AttendedTransfer() {
    var _this;

    _this = _React$Component.apply(this, arguments) || this;
    _this.state = {
      attendedTransferSessionPending: null,
      attendedTransferSessionReady: null
    };
    return _this;
  }

  var _proto = AttendedTransfer.prototype;

  _proto.attendedTransferCall = function attendedTransferCall() {
    var _this2 = this;

    if (this.props.attendedTransfersList.length >= this.props.phoneConfig.attendedTransferLimit) {
      this.props.attendedTransferLimitReached();
    } else {
      this.holdAll();
      this.props.attendedTransferRequest();
      var target = UserAgent.makeURI("sip:" + getFullNumber(this.props.destination) + "@" + this.props.sipAccount._credentials.sipuri.split('@')[1] + ";user=phone");

      if (target) {
        var inviter = new Inviter(this.props.userAgent, target);
        var outgoingSession = inviter;
        phoneStore.dispatch({
          type: NEW_ATTENDED_TRANSFER,
          payload: outgoingSession
        });
        this.setState({
          attendedTransferSessionPending: outgoingSession
        });
        outgoingSession.stateChange.addListener(function (newState) {
          switch (newState) {
            case SessionState.Initial:
            case SessionState.Establishing:
              _this2.props.stateChange(newState, outgoingSession.id);

              _this2.props.attendedTransferPending();

              break;

            case SessionState.Established:
              _this2.setState({
                attendedTransferSessionReady: outgoingSession
              });

              _this2.props.attendedTransferReady();

              _this2.setState({
                attendedTransferSessionPending: false
              });

              _this2.props.stateChange(newState, outgoingSession.id);

              setLocalAudio(outgoingSession);
              setRemoteAudio(outgoingSession);
              break;

            case SessionState.Terminating:
              _this2.props.stateChange(newState, outgoingSession.id);

              cleanupMedia(outgoingSession.id);
              break;

            case SessionState.Terminated:
              _this2.props.stateChange(newState, outgoingSession.id);

              _this2.attendedTransferClear();

              _this2.props.attendedTransferCancel(outgoingSession);

              setTimeout(function () {
                _this2.props.closeSession(outgoingSession.id);
              }, 5000);
              break;

            default:
              console.log("Unknown session state change: " + newState);
              break;
          }
        });
        outgoingSession.invite()["catch"](function (error) {
          _this2.props.attendedTransferFail(outgoingSession);

          console.log(error);
        });
      } else {
        console.log('Failed to makeURI');
      }
    }
  };

  _proto.attendedTransferClear = function attendedTransferClear() {
    this.setState({
      attendedTransferSessionPending: null
    });
    this.setState({
      attendedTransferSessionReady: null
    });
    this.props.started(false);
  };

  _proto.connectAttendedTransfer = function connectAttendedTransfer(attendedTransferSession) {
    try {
      this.props.session.refer(attendedTransferSession);
      this.props.attendedTransferSuccess();
      this.setState({
        attendedTransferSessionReady: null
      });
    } catch (err) {
      console.log(err);
    }
  };

  _proto.cancelAttendedTransfer = function cancelAttendedTransfer(attendedTransferSession) {
    attendedTransferSession.cancel();
    this.props.attendedTransferCancel(attendedTransferSession);
    this.setState({
      attendedTransferSessionPending: null
    });
    this.setState({
      attendedTransferSession: null
    });
  };

  _proto.holdAll = function holdAll() {
    var state = phoneStore.getState();
    var onHolds = state.sipSessions.onHold;

    if (this.props.session.id in onHolds === false) {
      try {
        this.props.holdCallRequest(this.props.session);
      } catch (err) {
        console.log(err);
      }

      return;
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    if (this.state.attendedTransferSessionReady) {
      var phoneConfigAttended = {
        disabledButtons: ['numpad', 'transfer'],
        disabledFeatures: [''],
        defaultDial: '',
        sessionsLimit: 0,
        attendedTransferLimit: 0,
        autoAnswer: false
      };
      return createElement(Fragment, null, createElement(Phone$1, {
        session: this.state.attendedTransferSessionReady,
        phoneConfig: phoneConfigAttended
      }), createElement("button", {
        className: styles$2.transferButtons,
        onClick: function onClick() {
          _this3.props.started(false);

          _this3.connectAttendedTransfer(_this3.state.attendedTransferSessionReady);
        }
      }, createElement("img", {
        src: connectIcon
      })));
    } else if (this.state.attendedTransferSessionPending) {
      return createElement("button", {
        className: styles$2.endCallButton,
        onClick: function onClick() {
          _this3.props.started(false);

          _this3.cancelAttendedTransfer(_this3.state.attendedTransferSessionPending);
        }
      }, createElement("img", {
        src: cancelIcon
      }));
    } else {
      return createElement("button", {
        className: styles$2.transferButtons,
        onClick: function onClick() {
          _this3.props.started(true);

          _this3.attendedTransferCall();
        }
      }, createElement("img", {
        src: attendedIcon
      }));
    }
  };

  return AttendedTransfer;
}(Component);

var mapStateToProps$6 = function mapStateToProps(state) {
  return {
    sipAccount: state.sipAccounts.sipAccount,
    stateChanged: state.sipSessions.stateChanged,
    sessions: state.sipSessions.sessions,
    userAgent: state.sipAccounts.userAgent,
    attendedTransfersList: state.sipSessions.attendedTransfers,
    phoneConfig: state.config.phoneConfig
  };
};

var actions$6 = {
  holdCallRequest: holdCallRequest,
  attendedTransferRequest: attendedTransferRequest,
  attendedTransferCancel: attendedTransferCancel,
  attendedTransferReady: attendedTransferReady,
  attendedTransferPending: attendedTransferPending,
  attendedTransferSuccess: attendedTransferSuccess,
  attendedTransferFail: attendedTransferFail,
  attendedTransferLimitReached: attendedTransferLimitReached,
  stateChange: stateChange,
  closeSession: closeSession
};
var AttendedTransfer$1 = connect(mapStateToProps$6, actions$6)(AttendedTransfer);

var endCallIcon = require('./assets/call_end-24px.svg');

var dialpadIcon = require('./assets/dialpad-24px.svg');

var transferIcon = require('./assets/arrow_forward-24px.svg');

var Phone = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Phone, _React$Component);

  function Phone(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      dialpadOpen: false,
      transferMenu: false,
      ended: false,
      transferDialString: '',
      attendedTransferStarted: false,
      duration: 0,
      counterStarted: false
    };
    _this.attendedProcess = _this.attendedProcess.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Phone.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.phoneConfig.disabledButtons.includes('dialpadopen')) {
      this.setState({
        dialpadOpen: true
      });
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(newProps) {
    if (newProps.session.state === SessionState.Established && !this.state.counterStarted) {
      this.handleCounter();
    }

    if (newProps.session.state === SessionState.Terminated && this.state.ended === false) {
      this.setState({
        ended: true
      });
    }
  };

  _proto.endCall = function endCall() {
    var _this2 = this;

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
    setTimeout(function () {
      _this2.props.session.dispose();

      _this2.props.endCall(_this2.props.session.id);

      if (_this2.props.strictMode === 'strict') {
        _this2.props.setAppConfigStarted();
      }
    }, 5000);
  };

  _proto.attendedProcess = function attendedProcess(bool) {
    this.setState({
      attendedTransferStarted: bool
    });
  };

  _proto.handleCounter = function handleCounter() {
    var _this3 = this;

    if (this.props.session && this.props.session.state !== SessionState.Terminated) {
      if (this.state.counterStarted === false) {
        this.setState({
          counterStarted: true
        });
      }

      setTimeout(function () {
        _this3.setState({
          duration: _this3.state.duration + 1
        });

        _this3.handleCounter();
      }, 1000);
    }
  };

  _proto.render = function render() {
    var _this4 = this;

    var state = this.state,
        props = this.props;
    var durationDisplay;

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

    return createElement(Fragment, null, props.phoneConfig.disabledFeatures.includes('remoteid') ? null : createElement(Fragment, null, createElement("hr", {
      style: {
        width: '100%'
      }
    }), createElement("div", null, props.session.remoteIdentity.uri.normal.user + " - " + props.session.remoteIdentity._displayName, createElement("br", null))), props.appSize === 'large' ? createElement("div", {
      className: styles$2.statusLarge
    }, statusMask(props.session.state)) : createElement("div", null, statusMask(props.session.state)), createElement("br", null), durationDisplay, state.ended ? null : createElement(Fragment, null, createElement(Dialpad$1, {
      open: state.dialpadOpen,
      session: props.session
    }), createElement("div", {
      className: styles$2.actionsContainer
    }, props.phoneConfig.disabledButtons.includes('mute') ? null : createElement(Mute$1, {
      session: props.session
    }), createElement("button", {
      className: styles$2.endCallButton,
      disabled: state.ended,
      onClick: function onClick() {
        return _this4.endCall();
      }
    }, createElement("img", {
      src: endCallIcon
    })), props.phoneConfig.disabledButtons.includes('hold') ? null : createElement(Hold$1, {
      session: props.session
    }), props.phoneConfig.disabledButtons.includes('numpad') ? null : createElement("div", {
      id: styles$2.actionButton,
      className: state.dialpadOpen ? styles$2.on : '',
      onClick: function onClick() {
        return _this4.setState({
          dialpadOpen: !state.dialpadOpen
        });
      }
    }, createElement("img", {
      src: dialpadIcon
    })), props.phoneConfig.disabledButtons.includes('transfer') ? null : createElement("div", {
      id: styles$2.actionButton,
      className: state.transferMenu ? styles$2.on : '',
      onClick: function onClick() {
        return _this4.setState({
          transferMenu: !state.transferMenu
        });
      }
    }, createElement("img", {
      src: transferIcon
    })), createElement("div", {
      id: styles$2.transferMenu,
      className: state.transferMenu ? '' : styles$2.closed
    }, createElement("input", {
      id: styles$2.transferInput,
      onChange: function onChange(e) {
        return _this4.setState({
          transferDialString: e.target.value
        });
      },
      placeholder: 'Enter the transfer destination...'
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
  };

  return Phone;
}(Component);

var mapStateToProps$7 = function mapStateToProps(state) {
  return {
    stateChanged: state.sipSessions.stateChanged,
    sessions: state.sipSessions.sessions,
    userAgent: state.sipAccounts.userAgent,
    deviceId: state.device.primaryAudioOutput,
    strictMode: state.config.appConfig.mode,
    appSize: state.config.appConfig.appSize
  };
};

var actions$7 = {
  endCall: endCall,
  setAppConfigStarted: setAppConfigStarted
};
var Phone$1 = connect(mapStateToProps$7, actions$7)(Phone);

var acceptIcon = require('./assets/call-24px.svg');

var declineIcon = require('./assets/call_end-24px.svg');

var ring = require('./assets/ring.mp3');

var Incoming = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Incoming, _React$Component);

  function Incoming() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Incoming.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this = this;

    toneManager.stopAll();
    toneManager.playRing('ringtone');
    console.log("auto-answer is: " + this.props.autoanswer);

    if (this.props.autoanswer) {
      this.timer = setInterval(function () {
        _this.handleAutoAnswer();
      }, 1000);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    clearInterval(this.timer);
  };

  _proto.handleAccept = function handleAccept() {
    toneManager.stopAll();

    if (this.props.session.state === SessionState.Initial) {
      this.props.session.accept({
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false
          }
        }
      });
    }

    this.props.acceptCall(this.props.session);
  };

  _proto.handleAutoAnswer = function handleAutoAnswer() {
    console.log('\n\n\n ************ handleAutoAnswer ********** \n\n\n');

    if (this.props.session.state === SessionState.Initial) {
      this.handleAccept();
    }

    clearInterval(this.timer);
  };

  _proto.handleDecline = function handleDecline() {
    toneManager.stopAll();

    if (this.props.session.state !== SessionState.Terminated && this.props.session.state !== SessionState.Terminating) {
      this.props.session.reject();
    }

    this.props.declineCall(this.props.session);
  };

  _proto.render = function render() {
    var _this2 = this;

    var props = this.props;
    return createElement("div", {
      id: styles$2.incoming
    }, "Incoming: " + props.session.remoteIdentity.uri.normal.user + " - " + props.session.remoteIdentity._displayName, createElement("div", {
      className: styles$2.endCallButton,
      onClick: function onClick() {
        return _this2.handleDecline();
      }
    }, createElement("img", {
      src: declineIcon
    })), createElement("div", {
      className: styles$2.startCallButton,
      onClick: function onClick() {
        return _this2.handleAccept();
      }
    }, createElement("img", {
      src: acceptIcon
    })), createElement("audio", {
      id: 'ringtone',
      loop: true
    }, createElement("source", {
      src: ring,
      type: 'audio/mpeg'
    })), createElement("audio", {
      id: this.props.session.id
    }));
  };

  return Incoming;
}(Component);

var mapStateToProps$8 = function mapStateToProps(state) {
  return {
    stateChanged: state.sipSessions.stateChanged
  };
};

var actions$8 = {
  acceptCall: acceptCall,
  declineCall: declineCall
};
var Incoming$1 = connect(mapStateToProps$8, actions$8)(Incoming);

var getSessions = function getSessions(sessions, phoneConfig, attendedTransfers, incomingCalls) {
  var elements = [];

  for (var session in sessions) {
    if (attendedTransfers.includes(session)) continue;

    if (incomingCalls.includes(session)) {
      if (Object.keys(sessions).length >= phoneConfig.sessionsLimit + incomingCalls.length) {
        console.log('Unable to create more sessions...');
        console.log('Check your phoneConfig.sessionsLimit option!');
      } else {
        elements.push(createElement(Incoming$1, {
          session: sessions[session],
          key: session,
          autoanswer: phoneConfig.autoAnswer
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

var PhoneSessions = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PhoneSessions, _React$Component);

  function PhoneSessions() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = PhoneSessions.prototype;

  _proto.render = function render() {
    return createElement(Fragment, null, getSessions(this.props.sessions, this.props.phoneConfig, this.props.attendedTransfers, this.props.incomingCalls));
  };

  return PhoneSessions;
}(Component);

var mapStateToProps$9 = function mapStateToProps(state) {
  return {
    sessions: state.sipSessions.sessions,
    incomingCalls: state.sipSessions.incomingCalls,
    attendedTransfers: state.sipSessions.attendedTransfers
  };
};

var PS = connect(mapStateToProps$9)(PhoneSessions);

var styles$3 = {"container":"_2iAE_","dialButton":"_3GsXr","dialButtonStrict":"_tfL15","dialInput":"_32AFz","dialstringContainerStrict":"_2qSFk","dialstringContainer":"_2sye_"};

var callIcon = require('./assets/call-24px.svg');

var callIconLarge = require('./assets/call-large-40px.svg');

var Dialstring = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Dialstring, _React$Component);

  function Dialstring() {
    var _this;

    _this = _React$Component.apply(this, arguments) || this;
    _this.state = {
      currentDialString: ''
    };
    return _this;
  }

  var _proto = Dialstring.prototype;

  _proto.handleDial = function handleDial() {
    var sessionsActive = Object.keys(this.props.sessions).length;
    var attendedTransferActive = this.props.attendedTransfersList.length;
    var sessionDiff = sessionsActive - attendedTransferActive;

    if (sessionDiff >= this.props.phoneConfig.sessionsLimit) {
      this.props.sessionsLimitReached();
    } else {
      if (this.props.appConfig.mode === 'strict') {
        this.props.sipAccount.makeCall(this.props.phoneConfig.defaultDial);
      }

      if (!this.checkDialstring()) {
        this.props.sipAccount.makeCall("" + this.state.currentDialString);
      }
    }
  };

  _proto.checkDialstring = function checkDialstring() {
    return this.state.currentDialString.length === 0;
  };

  _proto.render = function render() {
    var _this2 = this;

    var props = this.props;

    if (props.appConfig.mode.includes('strict') && props.started === true) {
      return createElement("div", {
        className: styles$3.dialstringContainerStrict
      }, createElement("button", {
        className: styles$3.dialButtonStrict,
        onClick: function onClick() {
          return _this2.handleDial();
        }
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
        onKeyPress: function onKeyPress(e) {
          if (e.key === 'Enter') {
            _this2.handleDial();

            e.preventDefault();
          }
        },
        placeholder: 'Enter the number to dial...',
        onChange: function onChange(e) {
          return _this2.setState({
            currentDialString: e.target.value
          });
        }
      }), createElement("button", {
        className: styles$3.dialButton,
        disabled: this.checkDialstring(),
        onClick: function onClick() {
          return _this2.handleDial();
        }
      }, createElement("img", {
        src: callIcon
      })));
    }
  };

  return Dialstring;
}(Component);

var mapStateToProps$a = function mapStateToProps(state) {
  return {
    sipAccount: state.sipAccounts.sipAccount,
    sessions: state.sipSessions.sessions,
    started: state.config.appConfig.started,
    attendedTransfersList: state.sipSessions.attendedTransfers
  };
};

var actions$9 = {
  sessionsLimitReached: sessionsLimitReached
};
var D = connect(mapStateToProps$a, actions$9)(Dialstring);

var sipSessions = function sipSessions(state, action) {
  var _extends2, _extends3, _extends4;

  if (state === void 0) {
    state = {
      sessions: {},
      incomingCalls: [],
      stateChanged: 0,
      onHold: [],
      attendedTransfers: []
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call');
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends2 = {}, _extends2[payload.id] = payload, _extends2)),
        incomingCalls: [].concat(state.incomingCalls, [payload.id])
      });

    case NEW_SESSION:
      console.log('New session added');
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends3 = {}, _extends3[payload.id] = payload, _extends3))
      });

    case NEW_ATTENDED_TRANSFER:
      return _extends(_extends({}, state), {}, {
        sessions: _extends(_extends({}, state.sessions), {}, (_extends4 = {}, _extends4[payload.id] = payload, _extends4)),
        attendedTransfers: [].concat(state.attendedTransfers, [payload.id])
      });

    case SIPSESSION_ATTENDED_TRANSFER_CANCEL:
    case SIPSESSION_ATTENDED_TRANSFER_FAIL:
      {
        var newAttendedTransfers = [].concat(state.attendedTransfers).filter(function (id) {
          return id !== payload.id;
        });
        return _extends(_extends({}, state), {}, {
          attendedTransfers: newAttendedTransfers
        });
      }

    case ACCEPT_CALL:
      {
        var acceptedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload.id;
        });
        return _extends(_extends({}, state), {}, {
          incomingCalls: acceptedIncoming
        });
      }

    case DECLINE_CALL:
      {
        var declinedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload.id;
        });

        var declinedSessions = _extends({}, state.sessions);

        delete declinedSessions[payload.id];
        return _extends(_extends({}, state), {}, {
          incomingCalls: declinedIncoming,
          sessions: declinedSessions
        });
      }

    case SIPSESSION_STATECHANGE:
      {
        return _extends(_extends({}, state), {}, {
          stateChanged: state.stateChanged + 1
        });
      }

    case CLOSE_SESSION:
      {
        var closedIncoming = [].concat(state.incomingCalls).filter(function (id) {
          return id !== payload;
        });

        var newSessions = _extends({}, state.sessions);

        delete newSessions[payload];
        var endHold = [].concat(state.onHold).filter(function (id) {
          return id !== payload;
        });
        return _extends(_extends({}, state), {}, {
          sessions: newSessions,
          incomingCalls: closedIncoming,
          onHold: endHold
        });
      }

    case SIPSESSION_HOLD_REQUEST:
      {
        return _extends(_extends({}, state), {}, {
          onHold: [].concat(state.onHold, [payload])
        });
      }

    case SIPSESSION_UNHOLD_REQUEST:
      {
        var newHold = [].concat(state.onHold).filter(function (id) {
          return id !== payload;
        });
        return _extends(_extends({}, state), {}, {
          onHold: newHold
        });
      }

    default:
      return state;
  }
};

var sipAccounts = function sipAccounts(state, action) {
  if (state === void 0) {
    state = {
      sipAccount: null,
      userAgent: null,
      status: ''
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case NEW_ACCOUNT:
      return _extends(_extends({}, state), {}, {
        sipAccount: action.payload
      });

    case NEW_USERAGENT:
      return _extends(_extends({}, state), {}, {
        userAgent: payload
      });

    default:
      return state;
  }
};

var device = function device(state, action) {
  if (state === void 0) {
    state = {
      audioInput: [],
      audioOutput: [],
      primaryAudioOutput: 'default',
      primaryAudioInput: 'default',
      sinkId: true
    };
  }

  var type = action.type,
      payload = action.payload;

  switch (type) {
    case AUDIO_INPUT_DEVICES_DETECTED:
      return _extends(_extends({}, state), {}, {
        audioInput: payload
      });

    case AUDIO_OUTPUT_DEVICES_DETECTED:
      return _extends(_extends({}, state), {}, {
        audioOutput: payload
      });

    case SET_PRIMARY_OUTPUT:
      return _extends(_extends({}, state), {}, {
        primaryAudioOutput: payload
      });

    case SET_PRIMARY_INPUT:
      return _extends(_extends({}, state), {}, {
        primaryAudioInput: payload
      });

    case AUDIO_SINKID_NOT_ALLOWED:
      return _extends(_extends({}, state), {}, {
        sinkId: false
      });

    default:
      return state;
  }
};

var config = function config(state, action) {
  if (state === void 0) {
    state = {
      uri: '',
      password: '',
      phoneConfig: {},
      appConfig: {
        mode: '',
        started: false,
        appSize: ''
      }
    };
  }

  switch (action.type) {
    case SET_PHONE_CONFIG:
      return _extends(_extends({}, state), {}, {
        phoneConfig: action.payload
      });

    case SET_CREDENTIALS:
      return _extends(_extends({}, state), {}, {
        uri: action.payload.uri,
        password: action.payload.password
      });

    case SET_APP_CONFIG:
      return _extends(_extends({}, state), {}, {
        appConfig: action.payload
      });

    case STRICT_MODE_SHOW_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return _extends(_extends({}, state), {}, {
          appConfig: _extends(_extends({}, state.appConfig), {}, {
            mode: 'strict',
            started: true
          })
        });
      }

      return state;

    case STRICT_MODE_HIDE_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return _extends(_extends({}, state), {}, {
          appConfig: _extends(_extends({}, state.appConfig), {}, {
            mode: 'strict',
            started: false
          })
        });
      }

      return state;

    default:
      return state;
  }
};

var reducers = combineReducers({
  sipAccounts: sipAccounts,
  sipSessions: sipSessions,
  device: device,
  config: config
});

var middleware = [thunk];
var persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['device']
};
var persistedReducer = persistReducer(persistConfig, reducers);
var defaultStore = createStore(persistedReducer, composeWithDevTools(applyMiddleware.apply(void 0, middleware)));
var persistor = persistStore(defaultStore);

var phoneStore = defaultStore;
var ReactSipPhone = function ReactSipPhone(_ref) {
  var name = _ref.name,
      phoneConfig = _ref.phoneConfig,
      sipConfig = _ref.sipConfig,
      appConfig = _ref.appConfig,
      sipCredentials = _ref.sipCredentials,
      _ref$containerStyle = _ref.containerStyle,
      containerStyle = _ref$containerStyle === void 0 ? {} : _ref$containerStyle;
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
    style: _extends({}, containerStyle)
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
