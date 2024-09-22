import React, { useEffect, useState } from 'react';
import AgoraUIKit from 'agora-react-uikit';
import AgoraRTM from 'agora-rtm-sdk';
import { useRemoteUsers } from 'agora-rtc-react';
import 'agora-react-uikit/dist/index.css';

export const LiveVideo = ({ isHost, setHost, token }) => {
  const [videocall, setVideocall] = useState(true);
  const [username, setUsername] = useState('');
  const appId = '4e017c610fe74330b9449b7968f03d2f';
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (isHost) {
      // Host logic here, if needed
    }
  }, [isHost]);

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Agora Video Call</h1>
        {videocall ? (
          <>
            <div style={styles.nav}>
              <p style={{ fontSize: 20 }}>
                You're {isHost ? 'the Host' : 'an Audience'}
              </p>
              <p style={styles.btn} onClick={() => setHost(!isHost)}>
                Change Role
              </p>
            </div>
            <AgoraUIKit
              rtcProps={{
                appId: appId,
                channel: 'test',
                token: token,
                role: isHost ? 'host' : 'audience',
                layout: 'grid', // Change as needed
                enableScreensharing: true,
              }}
              callbacks={{
                EndCall: () => setVideocall(false),
                UserJoined: (user) => {
                  console.log(`${user.uid} joined`);
                },
                UserLeft: (user) => {
                  console.log(`${user.uid} left`);
                },
              }}
            />
          </>
        ) : (
          <div style={styles.nav}>
            <input
              style={styles.input}
              placeholder="nickname"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h3 style={styles.btn} onClick={() => setVideocall(true)}>
              Start Call
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff22',
  },
  heading: { textAlign: 'center', marginBottom: 0 },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: {
    backgroundColor: '#007bff',
    cursor: 'pointer',
    borderRadius: 5,
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: 20,
  },
  input: { display: 'flex', height: 24, alignSelf: 'center' },
};

export default LiveVideo;