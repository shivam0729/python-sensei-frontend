import { useEffect } from "react";

export default function useResumeSocket(
  userId,
  onMessage
) {

  useEffect(() => {

    if (!userId) return;

    const ws = new WebSocket(
      `ws://localhost:8000/ws/${userId}`
    );

    ws.onopen = () => {

      console.log(
        "WebSocket Connected"
      );
    };

    ws.onmessage = (event) => {

      const data =
        JSON.parse(event.data);

      console.log(
        "Socket Message:",
        data
      );

      onMessage(data);
    };

    ws.onclose = () => {

      console.log(
        "WebSocket Closed"
      );
    };

    return () => {

      ws.close();
    };

  }, [userId]);
}