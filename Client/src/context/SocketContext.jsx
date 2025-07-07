import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();
  const [currentSocket, setCurrentSocket] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.id) return; // ✅ Prevent socket until userInfo exists

    const newSocket = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    socket.current = newSocket;
    setCurrentSocket(newSocket);

    newSocket.on("connect", () => {
    //   console.log("Socket connected:", newSocket.id);
    });

    const handleRecieveMessage = (message) => {
      const { selectedChatData, selectedChatType, addMessage } =
        useAppStore.getState();
      if (
        selectedChatType !== undefined &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.receiver._id)
      ) {
        // console.log(message.content);
         addMessage(message);
      }
    };
    newSocket.on("receiveMessage", handleRecieveMessage);

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={currentSocket}>
      {children}
    </SocketContext.Provider>
  );
};
