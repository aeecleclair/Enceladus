import { CdrUser, CdrUserPreview, getCdrUsers } from "@/api";
import { useAuth } from "@/app/authContext";
import { useTokenStore } from "@/stores/token";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export interface WSStatus {
  status: string;
}
interface UserStreamMessage {
  command: string;
  data: CdrUser | WSStatus;
}

export const useUsers = () => {
  const { isTokenExpired } = useAuth();
  const [returnedUsers, setReturnedUsers] = useState<CdrUserPreview[]>([]);
  const { isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await getCdrUsers();
      if (error) {
        throw error;
      }
      if (data) {
        setReturnedUsers(
          data.map((user) => {
            return {
              ...user,
              nickname: user.nickname ?? "",
            };
          }),
        );
      }
      return data;
    },
    retry: 3,
    enabled: !isTokenExpired(),
    staleTime: Infinity,
  });

  const { token } = useTokenStore();

  const WEBSOCKET_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace("http", "ws") +
    "/cdr/users/ws";

  useEffect(() => {
    if (isLoading) return;
    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onopen = () => {
      ws.send(JSON.stringify({ token: token }));
    };
    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const message = JSON.parse(event.data) as UserStreamMessage;
      if (message.command) {
        switch (message.command) {
          case "NEW_USER":
            const user = message.data as CdrUser;
            user.nickname = user.nickname ?? "";
            const userFound = returnedUsers.find((u) => u.id === user.id);
            if (!userFound) {
              setReturnedUsers([...returnedUsers, user]);
            } else {
              // This case can occur when a user is updated but we don't know if he already had an account before
              setReturnedUsers(
                returnedUsers.map((u) => (u.id === user.id ? user : u)),
              );
            }
            break;
          case "UPDATE_USER":
            const updatedUser = message.data as CdrUser;
            setReturnedUsers(
              returnedUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user,
              ),
            );
            break;
          case "WSStatus":
            if ((message.data as WSStatus).status === "invalid_token") {
              console.log("Invalid token");
            }
            break;
        }
      }
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => {
      ws.close();
    };
  }, [WEBSOCKET_URL, isLoading, returnedUsers, token]);

  return {
    users: returnedUsers,
    isLoading,
    refetch,
  };
};
