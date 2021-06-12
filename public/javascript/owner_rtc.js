/**
 * Copyright (c) Dhruv Shetty.
 *
 * @fileoverview Code for a WebRTC connection with a remote user (home-owner)
 * and the guest (unrecognized face) present at the door of the house.
 */

let localStream;
let remoteStream;

let localPeerConnection;
let remotePeerConnection;

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

// Exchange video only
const offerOptions = {
    offerToReceiveVideo: 1,
};

const status = document.querySelector('#status');
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');

// ----------------
// Helper functions
// ----------------

// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
    return (peerConnection === localPeerConnection) ? remotePeerConnection : localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
    return (peerConnection === localPeerConnection) ? 'localPeerConnection' : 'remotePeerConnection';
}

// ----------------------
// SDP and Server loggers
// ----------------------

// TODO: Implement server logger
// Logs an action (text) and the time when it happened on the console.
function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);

    console.log(now, text);
}

function setDescriptionSuccess(peerConnection, functionName) {
    // const peerName = getPeerName(peerConnection);
    // trace(`${peerName} ${functionName} complete.`);
}

function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

function setSessionDescriptionError(error) {
    // trace(`Failed to create session description: ${error.toString()}.`);
}

function handleConnectionSuccess(peerConnection) {
    // trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
}

function handleConnectionFailure(peerConnection, error) {
    // trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n` + `${error.toString()}.`);
}

function handleConnectionChange(event) {
    const peerConnection = event.target;
    // console.log('ICE state change event: ', event);
    // trace(`${getPeerName(peerConnection)} ICE state: ` + `${peerConnection.iceConnectionState}.`);
}

function handleConnection(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = getOtherPeer(peerConnection);

        otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
                handleConnectionSuccess(peerConnection);
            })
            .catch((error) => {
                handleConnectionFailure(peerConnection, error);
            });
    }
}

// Local media stream handlers
function gotLocalMediaStream(mediaStream) {
    status.innerText = 'Establishing call...';
    localVideo.srcObject = mediaStream;
    localStream = mediaStream;
}

function handleLocalMediaStreamError(error) {
    status.innerText = `${error.toString()}. Fix error and retry`;
}

// Remote media stream handler
function gotRemoteMediaStream(event) {
    status.innerText = 'Connected';
    const mediaStream = event.stream;
    remoteVideo.srcObject = mediaStream;
    remoteStream = mediaStream;
}

// Remote peer created answer handler
function createdAnswer(description) {
    remotePeerConnection.setLocalDescription(description)
        .then(() => {
            setLocalDescriptionSuccess(remotePeerConnection);
        })
        .catch(setSessionDescriptionError);

    localPeerConnection.setRemoteDescription(description)
        .then(() => {
            setRemoteDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);
}

// Local peer created offer handler
function createdOffer(description) {
    localPeerConnection.setLocalDescription(description)
        .then(() => {
            setLocalDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);

    remotePeerConnection.setRemoteDescription(description)
        .then(() => {
            setRemoteDescriptionSuccess(remotePeerConnection);
        })
        .catch(setSessionDescriptionError);

    remotePeerConnection.createAnswer()
        .then(createdAnswer)
        .catch(setSessionDescriptionError);
}

function establishCall() {
    // Display audio and video track being used
    // const videoTracks = localStream.getVideoTracks();
    // const audioTracks = localStream.getAudioTracks();
    // TODO: Provide options to choose media devices

    // STUN and TURN server config
    const servers = null;

    // Local peer connection and behaviour
    localPeerConnection = new RTCPeerConnection(servers);
    localPeerConnection.addEventListener('icecandidate', handleConnection);
    localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
    localPeerConnection.addStream(localStream);
    localPeerConnection.createOffer(offerOptions)
        .then(createdOffer)
        .catch(setSessionDescriptionError);

    // Remote peer connection and behaviour
    remotePeerConnection = new RTCPeerConnection(servers);
    remotePeerConnection.addEventListener('icecandidate', handleConnection);
    remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
    remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream, 1000);
}

async function initiateCall() {
    await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream)
        .catch(handleLocalMediaStreamError);
    setTimeout(establishCall, 2000);
}

setTimeout(initiateCall, 2000);
