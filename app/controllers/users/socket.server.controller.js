/**
 * Created by efelo on 22.06.15.
 */
module.exports.onConnect = function(socket){
    socket.on('disconnect', function() {
        console.log('Socket disconnected.');
    });
    socket.on('connect', function() {
        console.log('Socket connected.');
    });
    socket.on('getNewData', function(data) {
        socket.emit('getNewData_ret', data, null, null);
    });
}
