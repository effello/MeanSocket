/**
 * Created by efelo on 22.06.15.
 */
module.exports.onConnect = function(socket) {
    socket.on('getVars', function () {
        var app = require('../../server');
        var WinCCData = ''+app.get('WinCCData');
        var resArray = [];
        var Vars = [];
        if(WinCCData !== ''){
            WinCCData = WinCCData.split(/\r\n|\n/);
            Vars = WinCCData[0].split(';');
            for (var i=0; i<Vars.length;i++){
                resArray.push(Vars[i]);
            }
        }
        socket.emit('getVars_ret',resArray,null);

    });
    socket.on('disconnect', function () {
        console.log('Socket disconnected.');
    });
    socket.on('connect', function () {
        console.log('Socket connected.');
    });
};