import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(API_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket.io connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const joinTeamRoom = (teamId: string): void => {
  if (socket?.connected) {
    socket.emit('join_team', teamId);
  }
};

export const leaveTeamRoom = (teamId: string): void => {
  if (socket?.connected) {
    socket.emit('leave_team', teamId);
  }
};

// Event listeners helpers
export const onHabitCompleted = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('habit_completed', callback);
  }
};

export const onFeedUpdate = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('update_feed', callback);
  }
};

export const onLeaderboardUpdate = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('team_leaderboard_update', callback);
  }
};

export const offHabitCompleted = (callback?: (data: any) => void): void => {
  if (socket) {
    socket.off('habit_completed', callback);
  }
};

export const offFeedUpdate = (callback?: (data: any) => void): void => {
  if (socket) {
    socket.off('update_feed', callback);
  }
};

export const offLeaderboardUpdate = (callback?: (data: any) => void): void => {
  if (socket) {
    socket.off('team_leaderboard_update', callback);
  }
};

