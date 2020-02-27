document.write("<script type='text/javascript' src='node_modules/jquery/dist/jquery.min.js'></script>");
document.write("<script type='text/javascript' src='node_modules/webrtc-adapter/out/adapter.js'></script>");
document.write("<script type='text/javascript' src='src/js/webrtc-phone.js'></script>");
document.write("<script type='text/javascript' src='lib/janus-0.7.5.js'></script>");

var AmpleskyWebRTC = (function() {
    var registered = false;
    //登录
    var login = function(account, gateway_ip, mcu_ip ,LogState,errBack,callStateMessage,backJsonMsg,jspMsg) {
        if (!account) {
            console.error("请输入用户号");
            return;
        }
        if (!gateway_ip) {
            console.error("请输入WebRTC网关地址");
            return;
        }
        if (!mcu_ip) {
            console.error("请输入mcu后台地址");
            return;
        }
        //登录前首先去注销,呼叫存在既能注销,会报一个error,不影响功能,返回成功消息后发送的一个error,
        webrtcPhone.logout()
     
        //注册登录接口,success返回为登录状态1 成功, 0 失败
        webrtcPhone.initAndLogin({
            GateWay: gateway_ip,
            server: mcu_ip,
            name: account,
            exten: account,
            password: "123456"
        },function(success){
            registered =  success;
            // if (success) {
            //     registered = true;  
            // }else{
            //     registered = false;
            // }
            return LogState(success) 
        },function(errorback){
            return errBack(errorback)
        },function(callMessage){
            return callStateMessage(callMessage)
        },function (BackJsonMsg) {
            return backJsonMsg(BackJsonMsg)
        },function (Jsp) {
            return jspMsg(Jsp)                      
        });
        
    };

    //呼叫
    var call = function(callee, send_video ,recv_video, send_audio ,recv_audio, remote_video, remote_audio, local_video,callback) {
        if (callee && callee.trim().length > 0) {
            if (registered) {
                //drawVideo(container_id);
                webrtcPhone.initHtmlTag(remote_video, remote_audio, local_video);
                 webrtcPhone.call(callee, send_video,recv_video,send_audio,recv_audio,function(status){
                        
                        return callback(status)
                    });
                if (send_video && send_audio) {
                    // webrtcPhone.call(callee, true,true,true,true,function(status){
                        
                    //     return callback(status)
                    // });
                } else if (!send_video && send_audio) {
                    // webrtcPhone.call(callee, false,function(status){
                        
                    //     return callback(status)
                    // });
                } else {
                    console.error("视频与音频请至少选择一种方式");
                }
            } else {
                console.error("请先登录");
            }   
        } else {
            console.error("被叫号码不可为空");
        }
    };

    //挂断
    var hangup = function() {
        webrtcPhone.hangup();
        // registered = false;
    };

    //来电
    var getCommingCall = function(callbackMessage){
        webrtcPhone.getCommingCall(function(callBack){
            return callbackMessage(callBack)
        })
    }

    //来电接听
    var accept = function(remote_video, remote_audio, local_video){
        webrtcPhone.initHtmlTag(remote_video, remote_audio, local_video);
        webrtcPhone.answer(function(jsp){

        });
  
    }
    //来电拒绝
    var decline = function(){
        webrtcPhone.decline()
    }

    //开关麦克风功能  enable 传Bool值 true /false
    var mute = function(enable) {
        webrtcPhone.SDKSwitchAudio(enable)
    }

    return {
        login: login,
        call: call,
        hangup: hangup,
        accept:accept,
        decline:decline,
        getCommingCall:getCommingCall,
        mute:mute
    };
})();


function drawVideo(container_id) {
    if ($("#" + container_id).length > 0) {
        $("#" + container_id).html("");
        var remoteVideo = $('<video controls="controls" autoplay="autoplay" ></video>');
        remoteVideo.attr("id", "remote-stream-video");
        remoteVideo.attr("width", $("#" + container_id).width());
        remoteVideo.attr("height", $("#" + container_id).height());

        var remoteAudio = $('<audio autoplay="autoplay" ></audio>');
        remoteAudio.attr("id", "remote-stream-audio");

        var localVideo = $('<video controls="controls" autoplay="autoplay" ></video>');
        localVideo.attr("id", "local-stream-video");
        localVideo.attr("width", $("#" + container_id).width() / 3);
        localVideo.attr("height", $("#" + container_id).height() / 3);

        $("#" + container_id).append(remoteVideo).append(remoteAudio).append(localVideo);
    } else {
        console.error("找不到container_id");
    }
}