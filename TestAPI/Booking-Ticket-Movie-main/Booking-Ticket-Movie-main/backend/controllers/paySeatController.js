module.exports = (socket, rooms, io) => {
  socket.on("paySeat", ({ roomId, date, province, cinemaName, startTime, endTime, movieTitle, seatId }) => {
    const roomKey = `${date}-${province}-${cinemaName}-${startTime}-${endTime}-${movieTitle}-${roomId}`;
    const room = rooms[roomKey];
    if (room) {
      room.seatsStatus[seatId] = "not-choose"; // Mark the seat as unavailable
      console.log(`Seat ${seatId} paid for and marked as unavailable in room ${roomKey}`);
      io.to(roomKey).emit("seatsStatus", room.seatsStatus); // Emit updated seat statuses
    }
  });
};
