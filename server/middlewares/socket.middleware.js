let io;
let socket;
exports.connect = (server, prodaction, app) => {

    if(prodaction){
        io = require("socket.io")(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
              }
        })
    }else{
        io = require("socket.io")(server, {
            cors: {
              origin:  "*",
              methods: ["GET", "POST"]
            }
        })

    }

    return io
}

exports.get = () => {
    if (!io) {
       return false
    }
    return io;
}
