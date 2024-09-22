import React, { useEffect, useState } from 'react';
import AgoraRTC, {
    AgoraRTCProvider,
    useRTCClient,
} from "agora-rtc-react";
import { LiveVideo } from "./LiveVideo";

const LiveVideoStreaming = ({ isHost, user, setIsHost, uid, token }) => {
    const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }));

    useEffect(() => {
        const initHost = async () => {
            try {
                await agoraClient.join("4e017c610fe74330b9449b7968f03d2f","test", token, uid);
                
                // Create and publish local stream
                const localStream = AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: true,
                    screen: true,
                });
                 console.log("localStreamlocalStream",localStream)
                localStream.setVideoProfile("720p");
                await localStream.init();
                agoraClient.publish(localStream);

                agoraClient.on("stream-added", (evt) => {
                    const remoteStream = evt.stream;
                    agoraClient.subscribe(remoteStream, { audio: true, video: true });
                });

                agoraClient.on("stream-subscribed", (evt) => {
                    const remoteStream = evt.stream;
                    remoteStream.play("remote-container");
                });

                agoraClient.on("peer-leave", (evt) => {
                    console.log(`User ${evt.uid} left the channel`);
                });

            } catch (error) {
                console.error("Error joining the channel as host:", error);
            }
        };

        const initAudience = async () => {
            try {
                await agoraClient.join("4e017c610fe74330b9449b7968f03d2f", "test", token, uid);
                
                agoraClient.on("stream-added", (evt) => {
                    const remoteStream = evt.stream;
                    agoraClient.subscribe(remoteStream, { audio: true, video: true });
                });

                agoraClient.on("stream-subscribed", (evt) => {
                    const remoteStream = evt.stream;
                    remoteStream.play("remote-container"); // Play the host's video
                });

            } catch (error) {
                console.error("Error joining the channel as audience:", error);
            }
        };

        if (isHost) {
            initHost();
        } else {
            initAudience();
        }

        return () => {
            agoraClient.leave();
        };
    }, [isHost, agoraClient, token, uid]);

    return (
        <div>
            <AgoraRTCProvider client={agoraClient}>
                <LiveVideo isHost={isHost} user={user} setHost={setIsHost} token={token} />
                <div id="remote-container" style={{ width: '100%', height: '100%' }} />
            </AgoraRTCProvider>
        </div>
    );
};

export default LiveVideoStreaming;