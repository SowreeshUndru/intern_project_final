const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const user = require("../backend/models/usermodel.js");
const jwt = require("jsonwebtoken");
const Message = require("./models/messagemodel.js");
const generate = require("./services/ai.js")
const server = http.createServer(app);
var a = "";
const io = new Server(server, { cors: { origin: "*" } });

io.use(async function (socket, next) {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) return next(new Error("unauthorized user"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return next(new Error("unauthorized user"));

        const itemdetails = JSON.parse(socket.handshake.query.itemdetails);

        const roomid = socket.handshake.query?.roomid;
        const myid = socket.handshake.query.myid;

        socket.itemdetails = itemdetails;
        if (roomid === '2') {
            socket.roomid = "everyone";
        } else {

            socket.roomid = roomid !== "1" ? `${roomid}` : `${myid}.${itemdetails.userid}`;
          //  if(myid==itemdetails.userid) return next(new Error(""));
        }
        socket.user = decoded;
        console.log(socket.roomid);



        if (itemdetails.userid !== '') {
            await user.updateOne(
                { _id: itemdetails.userid },                  // Filter
                { $addToSet: { roomid: socket.roomid } }      // Update
            );
            await user.updateOne(
                { email:socket.user.email },                  // Filter
                { $addToSet: { roomid: socket.roomid } }
            )
        }
        //////////////////////////////////////////////////////////////////

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        try {
            const result = await Message.deleteMany({
                timestamp: { $lte: thirtyDaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old messages`);
        } catch (err) {
            console.error('Error deleting old messages:', err);
        }

        //////////////////////////////////////////////////////////////////

        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
});

io.on("connection", async (socket) => {
    console.log("User connected:", socket.user.email);
    socket.join(socket.roomid);


    const previousMessages = await Message.find({ roomId: socket.roomid })
        .sort({ timestamp: 1 })
        .limit(100);

    socket.emit("load-messages", previousMessages);
    ///////////////////////////////////////////////////////////////////
    if (a === "") {
        const response = await generate(`tell about guidelance and instructions if it is resolved keep msg #resolved..`);
        const text = JSON.parse(response.text).text;
        //console.log(text);

        socket.emit("aimessage", text);
        // a=0;
    }

    ///////////////////////////////////////////////////////////////////



    socket.on("send-message", async ({ message }) => {
        const msgData = {
            roomId: socket.roomid,
            senderEmail: socket.user.email,
            senderId: socket.user._id,
            text: message,
            timestamp: new Date()
        };
        if (message.split('#')[1] === "resolved") {
            await user.updateOne({ email: socket.user.email }, { $pull: { roomid: socket.roomid } });
            
            const response = await generate(`item was resolved thank them and tell rate our project which helps in upgradation..`);
            const text = JSON.parse(response.text).text;
            //console.log(text);
            

            io.to(socket.roomid).emit("aimessage", text);

        }else if(message.includes('@ai')){
            
            
            const response = await generate(`help if they tag @ai ${message}`);
            const text = JSON.parse(response.text).text;
            //console.log("ai speaks");
            //console.log(text);

            io.to(socket.roomid).emit("aimessage", text);
        }
        await Message.create(msgData);

        socket.to(socket.roomid).emit("receive-message", msgData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(process.env.PORT, function () {
    console.log(`Server running on port ${process.env.PORT}`);
});
