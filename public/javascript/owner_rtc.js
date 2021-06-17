/**
 * Copyright (c) Dhruv Shetty.
 *
 * @fileoverview WebRTC connection with a remote user (home-owner) and the guest
 * (unrecognized face) present at the door of the house through Socket.io
 */

// import adapter from 'webrtc-adapter';

// Global scope variables
let localStream;
let remoteStream;
let localPeerConnection;

// Socket.io config
const room = 'foo';
const socket = io();
let isInitiator = false;
let isChannelReady = false;
let isStarted = false;

// Video: HD, Audio: default
const mediaStreamConstraints = {
    video: {
        mandatory: {
            minWidth: 1280,
            minHeight: 720,
        },
    },
    audio: true,
};

// Options for media exchange through peer connection
const offerOptions = {
    offerToReceiveVideo: true,
    offerToReceiveAudio: true,
};

const status = document.querySelector('#status');
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');

/**
 * Socket.io event listeners.
 */
if (room !== '') {
    socket.emit('create or join', room);
}

socket.on('created', (room) => {
    isInitiator = true;
});

socket.on('join', (room) => {
    isChannelReady = true;
});

socket.on('joined', (room) => {
    isChannelReady = true;
});

socket.on('full', (room) => {
    console.log(`Room ${room} is full.`);
});

// Essence of long-polling on local and remote peers
socket.on('message', (message) => {
    if (message === 'got user media') {
        maybeStart();
    } else if (message.type === 'offer') {
        if (!isInitiator && !isStarted) {
            maybeStart();
        }
        localPeerConnection.setRemoteDescription(new RTCSessionDescription(message));
        establishAnswer();
    } else if (message.type === 'answer' && isStarted) {
        localPeerConnection.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {
        const candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate,
        });
        localPeerConnection.addIceCandidate(candidate);
    } else if (message === 'bye' && isStarted) {
        handleRemoteHangup();
    }
});

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now, text);
}

/**
 * Session Description Protocol (SDP) logging.
 */
function setDescriptionSuccess(peerConnection, functionName) {
    trace(`${functionName} complete.`);
}

function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

function setSessionDescriptionError(error) {
    trace(`Failed to create session description: ${error.toString()}.`);
}

function handleConnectionChange(event) {
    // TODO: Implementation of ICE restart
    // const peerConnection = event.target;
    // console.log('ICE state change event: ', event);
    trace('ICE state changed.');
}

/**
 * WebRTC connection handlers.
 */
function sendMessage(message) {
    socket.emit('message', message);
}

function handleIceCandidate(event) {
    const iceCandidate = event.candidate;
    trace('New ICE candidate: ');
    console.log(iceCandidate);
    if (iceCandidate) {
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
        });
    } else {
        trace('End of candidates.');
    }
}

function maybeStart() {
    if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
        establishCall();
    }
}

function stop() {
    trace('Shutting down connection...');
    isStarted = false;
    localPeerConnection.close();
    localPeerConnection = null;
}

function handleRemoteHangup() {
    stop();
    isInitiator = false;
}

// Local media stream handlers
function gotLocalMediaStream(mediaStream) {
    status.innerText = 'Establishing call...';
    localStream = mediaStream;
    localVideo.srcObject = localStream;
    trace(`Got local stream from: ${localStream.getVideoTracks()[0].label}`);
    sendMessage('got user media');
    if (isInitiator) {
        maybeStart();
    }
}

function handleLocalMediaStreamError(error) {
    trace(`Error: ${error.toString()}`);
    status.innerText = `${error.toString()}. Fix error and retry`;
}

// Remote media stream handler
function handleRemoteMediaStream(event) {
    trace('Getting remote video stream...');
    status.innerText = 'Connected';
    const mediaStream = event.streams[0];
    remoteStream = mediaStream;
    remoteVideo.srcObject = remoteStream;
    trace('Got remote video stream');
}

function removeRemoteMediaStream(event) {
    trace('Remote stream removed.');
}

// Remote peer created answer handler
function createdAnswer(sessionDescription) {
    trace('Creating answer: ');
    console.log(sessionDescription);
    localPeerConnection.setLocalDescription(sessionDescription)
        .then(() => {
            setRemoteDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);
    sendMessage(sessionDescription);
}

// Local peer created offer handler
function createdOffer(sessionDescription) {
    trace('Creating offer: ');
    console.log(sessionDescription);
    localPeerConnection.setLocalDescription(sessionDescription)
        .then(() => {
            setLocalDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);
    sendMessage(sessionDescription);
}

function establishCall() {
    // Display audio and video track being used
    // const videoTracks = localStream.getVideoTracks();
    // const audioTracks = localStream.getAudioTracks();
    // TODO: Provide options to choose media devices

    // Public Google STUN server config
    const servers = null;

    // Local peer connection and behaviour
    try {
        localPeerConnection = new RTCPeerConnection(servers);
        localPeerConnection.onicecandidate = handleIceCandidate;
        localPeerConnection.oniceconnectionstatechange = handleConnectionChange;
        localPeerConnection.ontrack = handleRemoteMediaStream;
        localPeerConnection.onremovetrack = removeRemoteMediaStream;
        trace('Created RTCPeerConnection.');
    } catch (error) {
        trace(`RTCPeerConnection creation error: ${error}`);
        alert('Could not create RTCPeerConnection. Try again later.');
    }
    localPeerConnection.addStream(localStream);
    isStarted = true;
    if (isInitiator) {
        localPeerConnection.createOffer(offerOptions)
            .then(createdOffer)
            .catch(setSessionDescriptionError);
    }
}

function establishAnswer() {
    localPeerConnection.createAnswer()
        .then(createdAnswer)
        .catch(setSessionDescriptionError);
}

async function initiateCall() {
    await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream)
        .catch(handleLocalMediaStreamError);
    setTimeout(establishCall, 2000);
}

trace('Initiating call...');
setTimeout(initiateCall, 2000);
