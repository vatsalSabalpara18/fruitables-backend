const { Server } = require('socket.io');

const connectSocket = () => {
    try {
        const io = new Server({
            cors: {
                origin: ["http://localhost:3000"]
            }
        });

        io.on("connection", async (socket) => {
            socket.emit("welcome", "Welcome to chat");
            console.log('socket', socket.id);

            socket.on("send_msg", ({ message, to }) => {
                console.log(message, to);

                try {
                    io.to(to).emit("receive_msg", message);
                } catch (error) {
                    console.error(error);
                }

            })

            socket.on("join_group", async (group) => {
                console.log(group);
                try {
                    socket.join(group);

                } catch (error) {
                    console.log(error);
                }
            })
        });


        io.listen(process.env.SOCKET_PORT);
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectSocket;