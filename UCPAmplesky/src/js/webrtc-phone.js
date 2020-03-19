var webrtcPhone = (function () {

  var server;
  var janusUrl;
  var name;
  var password;
  var exten;
  var audioId;
  var localVideoId;
  var remoteVideoId;
  var janus;
  var sipcall;
  var incoming;
  var currentJsep;
  var localStream;
  var remoteStreamAudio;
  var remoteStreamVideo;
  var counterpartNum;
  var started = false;
  var registered = false;
  var sipRegister = false
  var GateWay;
  var supportedDevices = {};
  var ringing = new Audio('sounds/ringing.mp3');
  var calling = new Audio('sounds/calling.mp3');
  ringing.loop = true;
  calling.loop = true;
  var issipCall;
  var VideoCall;
  var audioEnable = false
  var videoEnable = false
  var commingName;
  var  callErrorresult; //记录所有服务返回的错误信息
  var  callState //呼叫状态
  let callStatefuntionback; //呼叫状态的回调
  var callStateBack //呼叫状态回调函数
  let RoomisMutAudio //记录Room房间是否关闭扬声器
  // videoRoom变量
  var Roomjanus
  var videoRoomCall;
  var myusername = null;
  var myid = null;
  var mystream = null;
  var opaqueId = "videoroomtest-"+Math.random().toString
  // We use this other ID just to map our subscriptions to us
  var mypvtid = null;
  var feeds = [];
  var remoteList = {}
  var RoomhandleRemote = {}
  var remoteNameList = {}
  var VideoRoomStream
  var RoomNumber

  //Streaming 变量
var Streaming;

//shareScreen 
let capture = null
let role = null



    var getSupportedDevices = function (origCallback) {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function (callback) {
        navigator.mediaDevices.enumerateDevices().then(callback);
      };
    }

    var MediaDevices = [];
    var isHTTPs = location.protocol === 'https:';
    var canEnumerate = false;

    if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
      canEnumerate = true;
    } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
      canEnumerate = true;
    }

    var hasMicrophone = false;
    var hasSpeakers = false;
    var hasWebcam = false;

    var isMicrophoneAlreadyCaptured = false;
    var isWebcamAlreadyCaptured = false;

    function checkDeviceSupport(callback) {
      if (!canEnumerate) {
        return;
      }

      if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
      }

      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
      }

      if (!navigator.enumerateDevices) {
        if (callback) {
          callback();
        }
        return;
      }

      MediaDevices = [];
      navigator.enumerateDevices(function (devices) {
        devices.forEach(function (_device) {
          var device = {};
          for (var d in _device) {
            device[d] = _device[d];
          }

          if (device.kind === 'audio') {
            device.kind = 'audioinput';
          }

          if (device.kind === 'video') {
            device.kind = 'videoinput';
          }

          var skip;
          MediaDevices.forEach(function (d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true;
            }
          });

          if (skip) {
            return;
          }

          if (!device.deviceId) {
            device.deviceId = device.id;
          }

          if (!device.id) {
            device.id = device.deviceId;
          }

          if (!device.label) {
            device.label = 'Please invoke getUserMedia once.';
            if (!isHTTPs) {
              device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
            }
          } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true;
            }

            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true;
            }
          }

          if (device.kind === 'audioinput') {
            hasMicrophone = true;
          }

          if (device.kind === 'audiooutput') {
            hasSpeakers = true;
          }

          if (device.kind === 'videoinput') {
            hasWebcam = true;
          }

          // there is no 'videoouput' in the spec.
          MediaDevices.push(device);
        });

        if (callback) {
          callback();
        }
      });
    }
    // check for microphone/camera support!
    checkDeviceSupport(function () {
      supportedDevices = {
        audio: hasMicrophone,
        audioCap: isMicrophoneAlreadyCaptured,
        video: hasWebcam,
        videoCap:isWebcamAlreadyCaptured 
      };
      $(document).trigger('supportedDevices', supportedDevices);
      origCallback();
    });
  };
  var ReloadDevice = function (origCallback){
     if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function (callback) {
        navigator.mediaDevices.enumerateDevices().then(callback);
      };
    }

    var MediaDevices = [];
    var isHTTPs = location.protocol === 'https:';
    var canEnumerate = false;

    if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
      canEnumerate = true;
    } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
      canEnumerate = true;
    }

    var hasMicrophone = false;
    var hasSpeakers = false;
    var hasWebcam = false;

    var isMicrophoneAlreadyCaptured = false;
    var isWebcamAlreadyCaptured = false;

    function checkDeviceSupport(callback) {
      if (!canEnumerate) {
        return;
      }

      if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
      }

      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
      }

      if (!navigator.enumerateDevices) {
        if (callback) {
          callback();
        }
        return;
      }

      MediaDevices = [];
      navigator.enumerateDevices(function (devices) {
        devices.forEach(function (_device) {
          var device = {};
          for (var d in _device) {
            device[d] = _device[d];
          }

          if (device.kind === 'audio') {
            device.kind = 'audioinput';
          }

          if (device.kind === 'video') {
            device.kind = 'videoinput';
          }

          var skip;
          MediaDevices.forEach(function (d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true;
            }
          });

          if (skip) {
            return;
          }

          if (!device.deviceId) {
            device.deviceId = device.id;
          }

          if (!device.id) {
            device.id = device.deviceId;
          }

          if (!device.label) {
            device.label = 'Please invoke getUserMedia once.';
            if (!isHTTPs) {
              device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
            }
          } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true;
            }

            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true;
            }
          }

          if (device.kind === 'audioinput') {
            hasMicrophone = true;
          }

          if (device.kind === 'audiooutput') {
            hasSpeakers = true;
          }

          if (device.kind === 'videoinput') {
            hasWebcam = true;
          }

          // there is no 'videoouput' in the spec.
          MediaDevices.push(device);
        });

        if (callback) {
          callback();
        }
      });
    }
    // check for microphone/camera support!
    checkDeviceSupport(function () {
      supportedDevices = {
        audio: hasMicrophone,
        audioCap: isMicrophoneAlreadyCaptured,
        video:  hasWebcam,
        videoCap: isWebcamAlreadyCaptured,
      };
      
      $(document).trigger('supportedDevices', supportedDevices);
      // origCallback();
    });
  }


  function initAndLogin(data,back,errorback,callStateMessage,backJsonMsg,jspMsg) {
    janusUrl = data.GateWay
    // if(data.GateWay.indexOf('.com') > 0 || window.location.protocol === 'https:'){
    //   janusUrl = 'https://' + data.GateWay + '/janus';
    // }else{
    //   janusUrl = 'http://' + data.GateWay + '/janus';
    // }
    server = data.server;
    name = data.name;
    exten = data.exten;
    GateWay = data.GateWay;
    password = data.password;
    audioId = data.audioId;
    localVideoId = data.localVideoId;
    remoteVideoId = data.remoteVideoId;
    localStream = localVideoId;
    remoteStreamAudio = audioId;
    remoteStreamVideo = remoteVideoId;
    registered = false
    sipRegister = false
    registerVideoCall(function (success){
      return back(success);
    },function(error){
      return  errorback(error);
    },function(callStateMs){
      return callStateMessage(callStateMs);
    },function(jsonMsg){
      return backJsonMsg(jsonMsg)
    },function(jsp){
      return jspMsg(jsp)
    })
  }

  function registSipCall(registSipBack,errorBack,CallStateMessage,backJsonMsg,jspMsg){
    janus.attach({
      plugin: "janus.plugin.sip",
      opaqueId: opaqueId,
      success: function (pluginHandle) {
        sipcall = pluginHandle;
        Janus.log("Plugin attached! (" + sipcall.getPlugin() + ", id=" + sipcall.getId() + ")");
        getSupportedDevices(function () {
          login();
        });
      },
      error: function (error) {
        sipRegister = false
        calling.pause();
        ringing.pause();
        $(document).trigger('netError');
        Janus.error("  -- Error attaching plugin...", error);
      },
      onmessage: function (msg, jsep) {
        if(msg != null && msg != undefined){
          backJsonMsg(msg)
        }
        
        if(jsep != null && jsep != undefined){
          jspMsg(jsep)
        }
        
        Janus.debug(" ::: Got a message :::");
        Janus.debug(JSON.stringify(msg));
        
        // Any error? 
        var error = msg["error"];
        if (error != null && error != undefined) {
          calling.pause();
          ringing.pause();
          callErrorresult = error;
          errorBack(error);
          
          if (!sipRegister) {
            Janus.log("User is not registered");
          } else {
            sipcall.hangup();
          }
          if (callStatefuntionback) {
            return callStatefuntionback(0)   
          }
        }
        var result = msg["result"];
        if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
        
          // get event
          var event = result["event"];

          //switch event
          switch (event) {
            case 'registration_failed':
                registSipBack(0)
                errorBack('sip  '+result["reason"])
              Janus.error("Registration failed: " + result["code"] + " " + result["reason"]);
              return;
              break;

            case 'registered':
                
              if (!sipRegister) {
                Janus.log("Successfully registered as " + result["username"] + "!");
                sipRegister = true;
                registSipBack(1)
              }
              break;

            case 'unregistered':
                errorBack("Successfully unregistered as " + result["username"] + "!")
              Janus.log("Successfully unregistered as " + result["username"] + "!");
              if (sipRegister) {
                sipRegister = false;
                $(document).trigger('unregistered');
                registSipBack(0)
              }
              
              break;

            case 'calling':
                
              // 
              Janus.log("Waiting for the peer to answer...");
              $(document).trigger('calling');
              CallStateMessage('calling') 
              if (callStatefuntionback) {
                return callStatefuntionback(1)   
              }
              break;
              
            case 'incomingcall':
              issipCall = true
              currentJsep = jsep;
              counterpartNum = msg.result.username.split('@')[0].split(':')[1];
              incoming = true;
              ringing.play();
              commingName = result["username"]
              
              Janus.log("Incoming call from " + result["username"] + "!");
              $(document).trigger('incomingcall', counterpartNum);
              CallStateMessage('incomingcall')
              break;

            case 'progress':
              Janus.log("There's early media from " + result["username"] + ", wairing for the call!");
              if (jsep !== null && jsep !== undefined) {
                handleRemote(jsep);
              }
              break;

            case 'accepted':
                
              calling.pause();
              ringing.pause();
              Janus.log(result["username"] + " accepted the call!");
              if (jsep !== null && jsep !== undefined) {
                handleRemote(jsep);
              }
              $(document).trigger('callaccepted');
              CallStateMessage('accepted')
              break;

            case 'hangup':
              // callStateBack('accepted')
              incoming = null;
              calling.pause();
              ringing.pause();
              Janus.log("Call hung up (" + result["code"] + " " + result["reason"] + ")!");
              sipcall.hangup();

              if (result["reason"] == 'Busy Here') {
                $(document).trigger('Busy');
              }
              $(document).trigger('hangup',[result["code"],result["reason"]]);
              CallStateMessage('hangup')
              break;
            case 'decline':
                
            break
            default:
              break;
          }


        }
       
      },
      onlocalstream: function (stream) {
        Janus.debug(" ::: Got a local stream :::");
        Janus.debug(JSON.stringify(stream));
        Janus.attachMediaStream($("#" + localStream).get(0), stream);
        /* IS VIDEO ENABLED ? */
        // var videoTracks = stream.getVideoTracks();
        /* */
      },
      onremotestream: function (stream) {
        
        Janus.debug(" ::: Got a remote stream :::");
        Janus.debug(JSON.stringify(stream));

        // retrieve stream track
        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        Janus.attachMediaStream($("#" + remoteStreamAudio).get(0), new MediaStream(audioTracks));
        Janus.attachMediaStream($("#" + remoteStreamVideo).get(0), new MediaStream(videoTracks));
      },

      oncleanup: function () {
        Janus.log(" ::: Got a cleanup notification :::");
      }
    });

  }

  function registerVideoCall(registBack,errorBack,callStateMessage,backJsonMsg,jspMsg){

    if (VideoCall){
      for(var s in Janus.sessions) {
        if(Janus.sessions[s] !== null && Janus.sessions[s] !== undefined &&
          Janus.sessions[s].destroyOnUnload) {
            Janus.log("Destroying session " + s);
            Janus.sessions[s].destroy({asyncRequest: false, notifyDestroyed: false});
        }
      } 
    }
    if(janus){
      janus.destroy()
    }
    Janus.init({
      debug: "all",
      callback: function () {
        if (VideoCall) {
          logout()
        }
        started = true;
        if (!Janus.isWebrtcSupported()) {
          console.error("No WebRTC support... ");
          return;
        }
        // Create session
        janus = new Janus({
          server: janusUrl,
          success: function () {
            janus.attach({
              plugin: "janus.plugin.videocall",
              success: function (pluginHandle) {
                VideoCall = pluginHandle;
                Janus.log("Plugin attached! (" + VideoCall.getPlugin() + ", id=" + VideoCall.getId() + ")");
                getSupportedDevices(function () {
                  let register = {"request": "register", "username": name};
                  VideoCall.send({"message": register});
                });
              },
              
              error: function (error) {
                calling.pause();
                ringing.pause();
                Janus.error("  -- Error attaching plugin...", error);
              },
              onmessage: function (msg, jsep) {
                Janus.debug(" ::: Got a message :::");
                Janus.debug(JSON.stringify(msg));
                // Any error?
                if(msg != null && msg != undefined){
                  backJsonMsg(msg)
                }
                if(jsep != null && jsep != undefined){
                  jspMsg(jsep)
                }
                var error = msg["error"];
                if (error != null && error != undefined) {
                  callErrorresult = error;
                  calling.pause();
                  ringing.pause();
                  errorBack(error);
                  if (!registered) {
                    Janus.log("User is not registered");
                  } else {
                    // Reset status
                    VideoCall.hangup();
                  }
                  if (callStatefuntionback) {
                    return callStatefuntionback(0)   
                  }
                }
                var result = msg["result"];
                if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
                  var event = result["event"];
                  //switch event
                  switch (event) {
                    case 'registration_failed':
                      Janus.error("Registration failed: " + result["code"] + " " + result["reason"]);
                      registBack(0)
                      errorback('mcu  '+  result["reason"])
                      return;
                      break;

                    case 'registered':
                      if (!registered) {
                        Janus.log("Successfully registered as " + result["username"] + "!");
                        registered = true;
                         registSipCall(function(sipRegist){
                              registBack(sipRegist)
                        },function(sipError){
                              errorBack(sipError)
                        },function(callMessage){
                          callStateMessage(callMessage)
                        },function (jsonMsg){
                          backJsonMsg(jsonMsg)
                        },function (jsp) {
                          jspMsg(jsp)
                        });
                        // $(document).trigger('registered');
                      }
                      break;

                    case 'unregistered':
                      // callStateBack('unregistered')
                      Janus.log("Successfully unregistered as " + result["username"] + "!");
                      if (registered) {
                        registered = false;
                        $(document).trigger('unregistered');
                        registBack(0)
                      }
                      
                      break;

                    case 'calling':
                        
                      // callStateBack('calling')
                      Janus.log("Waiting for the peer to answer...");
                      $(document).trigger('calling');
                      callStateMessage('calling')
                      if (callStatefuntionback) {
                        return callStatefuntionback(1)   
                      }
                      break;

                    case 'incomingcall':
                      currentJsep = jsep;  
                      issipCall = false
                      commingName = result["username"]
                      
                      counterpartNum = msg.result.username.split('@')[0].split(':')[1];
                      incoming = true;
                      ringing.play();
                      Janus.log("Incoming call from " + result["username"] + "!");
                      
                      $(document).trigger('incomingcall', counterpartNum);
                      callStateMessage('incomingcall')
                      break;

                    case 'progress':
                      Janus.log("There's early media from " + result["username"] + ", wairing for the call!");
                      if (jsep !== null && jsep !== undefined) {
                        handleRemote(jsep);
                      }
                      break;
                    case 'accepted':
                      // callStateBack('accepted')
                      calling.pause();
                      ringing.pause();
                      
                      if (jsep !== null && jsep !== undefined) {
                        handleRemote(jsep);
                      }
                      $(document).trigger('callaccepted');
                      callStateMessage('accepted')
                      
                      // VideoCall.getMessageInfo(function (message){
                      //   console.log(message)
                      // })
                      
                      break;

                    case 'hangup':
                      // callStateBack(accepted)
                      incoming = null;
                      calling.pause();
                      ringing.pause();
                     
                      VideoCall.hangup();
                      $(document).trigger('hangup',[result["code"],result["reason"]]);
                      if (result["reason"] == 'Busy Here') {
                        $(document).trigger('Busy');
                      }
                      callStateMessage('hangup')
                      break;
                    case 'decline':
                        incoming = null;
                        calling.pause();
                        ringing.pause();
                        $(document).trigger('declineCall');
                    case 'updatingcall':   
                        
                        break;
                    default:
                      break;
                  }
                }
              },
              onlocalstream: function (stream) {
                Janus.debug(" ::: Got a local stream :::");
                Janus.debug(JSON.stringify(stream));
                Janus.attachMediaStream($("#" + localStream).get(0), stream);
                /* IS VIDEO ENABLED ? */
                var videoTracks = stream.getVideoTracks();
                /* */
              },
              onremotestream: function (stream) {
                Janus.debug(" ::: Got a remote stream :::");
                Janus.debug(JSON.stringify(stream));

                // retrieve stream track
                var audioTracks = stream.getAudioTracks();
                var videoTracks = stream.getVideoTracks();

                Janus.attachMediaStream($("#" + remoteStreamAudio).get(0), new MediaStream(audioTracks));
                Janus.attachMediaStream($("#" + remoteStreamVideo).get(0), new MediaStream(videoTracks));
              },
              oncleanup: function () {
                
              }
            });
          },
          error: function (error) {
            $(document).trigger('netError');
            started = false;
            registered = false;
            registBack(0)
            errorBack(error)
            // Janus.error(error);
            // console.error("Janus error: " + error);
            // reject();
          },
          destroyed: function () {    
            $(document).trigger('netError'); 
            started = false;
            registered = false;        
            // reject();
          }
        });
      }
    });
  }

  function login() {
        var register = {
          username: 'sip:' + name + '@' + server,
          display_name: name,
          authuser:name,
          secret: password,
          proxy: 'sip:'+server+':5060',
          sips: false,
          request: 'register'
        };
        sipcall.send({
          'message': register
        });
  }
//登录前首先去注销,呼叫存在既能注销,会报一个error,不影响功能,返回成功消息后发送的一个error,
  function logout() { 
    if(issipCall){
      if (sipcall) {
        var unregister = {
          request: 'unregister'
        };
        sipcall.send({
          'message': unregister
        });

        // janus = null
      }

    }else{
      
    }

    if(videoRoomCall){
      Roomjanus.destroy()
    }

    if (VideoCall) { 
        // Janus.destroy()
        for(var s in Janus.sessions) {
          if(Janus.sessions[s] !== null && Janus.sessions[s] !== undefined &&
            Janus.sessions[s].destroyOnUnload) {
              
              Janus.sessions[s].destroy({asyncRequest: false, notifyDestroyed: false});
          }
        } 
          
    }
    // Janus.sessions ={}
    sipRegister = false
    registered = false
  }


  function refreshLogOut(){
    if(issipCall){
      if (sipcall) {
        var unregister = {
          request: 'unregister'
        };
        sipcall.send({
          'message': unregister
        });
      }

    }else{
      
    }

    if(videoRoomCall){
      Roomjanus.destroy()
    }
    if (VideoCall) { 
        Janus.destroy()
        // for(var s in Janus.sessions) {
        //   if(Janus.sessions[s] !== null && Janus.sessions[s] !== undefined &&
        //     Janus.sessions[s].destroyOnUnload) {
        //       Janus.log("Destroying session " + s);
        //       Janus.sessions[s].destroy({asyncRequest: false, notifyDestroyed: false});
        //   }
        // }    
    }
    // Janus.sessions ={}
    sipRegister = false
    registered = false
  }



  //返回特定字符串前的字符或后的字符
  function getStr(string,str){
    var str_before = string.split(str)[0];
    var str_after = string.split(str)[1];
    if (str_before.length > 0) {
      return str_before
    }else{
      return str_after
    }
  }

  function call(to, videoSend, videoRecv, audioSend,audioRecv, callstatesback) {
    calling.play();
    callStatefuntionback  = callstatesback
    issipCall = ((to.indexOf("@") != -1) ||(to.indexOf("+") != -1));
    let name = getStr(to,"@")
    var IP;
    var sipUri;
    if((to.indexOf("@") != -1)){
      IP = to.split("@")[1];
      sipUri  = 'sip:' + name +'@'+ IP;
    }else if((to.indexOf("+") != -1)){
      IP = to.split("+")[1];
      sipUri  = 'sip:' + IP +'@'+ server;
    }

    let SpecName;
    if(((to.indexOf("@") != -1) && (to.indexOf("+") != -1))){
      SpecName = to.split("+")[1];
      SpecName = getStr(SpecName,"@")
      IP = to.split("@")[1];
      sipUri  = 'sip:' + SpecName +'@'+ IP;
    }
    if(issipCall){
     
      getSupportedDevices(function () {
        
        sipcall.createOffer({
          media: {
            audioSend: audioSend,
            audioRecv: audioRecv,
            videoSend: videoSend,
            videoRecv: videoRecv
          },
          success: function (jsep) {
            Janus.debug("Got SDP!");
            
            // jsep.sdp = jsep.sdp.replace("http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01","")
            // jsep.sdp = jsep.sdp.replace("http://www.webrtc.org/experiments/rtp-hdrext/playout-delay","")
            // jsep.sdp = jsep.sdp.replace("http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time","")
            // jsep.sdp = jsep.sdp.replace("http://www.webrtc.org/experiments/rtp-hdrext/video-timing","")
            
            
            Janus.log(jsep.sdp);
            var body = {
              request: "call",
              uri: sipUri
            };
            // jsep.sdp = jsep.sdp.replace("a=rtpmap:96 H264/90000","a=rtpmap:96 VP8/90000")
            // jsep.sdp = jsep.sdp.replace("a=rtpmap:98 H264/90000","a=rtpmap:98 VP9/90000")
            sipcall.send({
              "message": body,
              "jsep": jsep
            });
            counterpartNum = to;
          },
          error: function (error) {
            Janus.error("WebRTC error...", error);
            if (callStatefuntionback) {
              return callStatefuntionback(0)   
            }
          }
        });
      });
    }else{
      getSupportedDevices(function () {

      VideoCall.createOffer(
        {
          media: {
            audioSend: audioSend,
            audioRecv: audioRecv,
            videoSend: videoSend,
            videoRecv: videoRecv
          },	
          simulcast: false,
          success: function(jsep) {
            
            Janus.debug("Got SDP!");
            Janus.debug(jsep);
            var body = { "request": "call", "username":name};
            VideoCall.send({"message": body, "jsep": jsep});
          },
          error: function(error) {
            
            Janus.error("WebRTC error...", error);
            if (callStatefuntionback) {
              return callStatefuntionback(0)   
            }
          }
        });
      })
    }
  }

  function handleRemote(jsep) {
    if(issipCall){
      Janus.log(jsep.sdp);
      sipcall.handleRemoteJsep({
        jsep: jsep,
        error: function () {
          var hangup = {
            "request": "hangup"
          };
          sipcall.send({
            "message": hangup
          });
          sipcall.hangup();
        }
      });
    }else{
      VideoCall.handleRemoteJsep({
        jsep: jsep,
        error: function () {
          var hangup = {
            "request": "hangup"
          };
          VideoCall.send({
            "message": hangup
          });
          VideoCall.hangup();
        }
      });
    }
  };

  function answer(callJsp) {
    let isVideo = (currentJsep.sdp.indexOf("m=video ") > -1);
    incoming = null;
    if(issipCall){
      getSupportedDevices(function () {
        sipcall.createAnswer({
          jsep: currentJsep,
          media: {
            audio: true,
            video: isVideo
          },
          success: function (jsep) {
            Janus.debug("Got SDP! audio=" + true + ", video=" + true);
            Janus.debug(jsep);
            var body = {
              request: "accept"
            };
            // jsep.sdp = jsep.sdp.replace("a=rtpmap:96 H264/90000","a=rtpmap:96 VP8/90000")
            // jsep.sdp = jsep.sdp.replace("a=rtpmap:98 H264/90000","a=rtpmap:98 VP9/90000")
            sipcall.send({
              "message": body,
              "jsep": jsep
            });
          },
          error: function (error) {
            Janus.error("WebRTC error:", error);
            var body = {
              "request": "decline",
              "code": 480
            };
            sipcall.send({
              "message": body
            });
          }
        });
      });
    }else{
      getSupportedDevices(function () {
        VideoCall.createAnswer({
          jsep: currentJsep,
          media: {
            audio: true,
            video: isVideo,
          },
          success: function (jsep) {
            Janus.debug("Got SDP! audio=" + true + ", video=" + true);
            Janus.debug(jsep);
            var body = {
              request: "accept"
            };
            VideoCall.send({
              "message": body,
              "jsep": jsep
            });
          },
          error: function (error) {
            Janus.error("WebRTC error:", error);
            var body = {
              "request": "decline",
              "code": 480
            };
            VideoCall.send({
              "message": body
            });
          }
        });
      });
    }
    return callJsp(currentJsep)
  }

  function hangup(e) {
    calling.pause();
    ringing.pause()
    if (incoming) {
      decline();
      return;
    }
    var hangup = {
      "request": "hangup"
    };
    if(issipCall){
      sipcall.send({
        "message": hangup
      });
      sipcall.hangup();
    }else{
      if(VideoCall){
        VideoCall.send({
          "message": hangup
        });
        VideoCall.hangup();
      }
      
    }
  }
  function getCommingCall(jespCall){
    return  jespCall(commingName)
  }
  function decline() {
    incoming = null;
    var body = {
      "request": "decline"
    };
    if(issipCall){
      sipcall.send({
        "message": body
      });
    }else{
      var hangup = { "request": "hangup" };
      VideoCall.send({"message": hangup});
	    VideoCall.hangup();

    }
  };

  function getCounterpartNum() {
    return counterpartNum;
  };
  function SwitchAudio(){
    audioEnable = !audioEnable
    if(issipCall){
      if(audioEnable){
        sipcall.muteAudio()
    }else{
        sipcall.unmuteAudio()
    }
    }else{
      if(audioEnable){
        VideoCall.muteAudio();
      }else {
        VideoCall.unmuteAudio();
      }
    }
  }

function SDKSwitchAudio(mute) {
  if(issipCall){
    if(mute){
      sipcall.muteAudio()
  }else{
      sipcall.unmuteAudio()
  }
  }else{
    if(mute){
      VideoCall.muteAudio();
    }else {
      VideoCall.unmuteAudio();
    }
  }
}

function AllOpen(){
  audioEnable  = false
  videoEnable = false
}

  function SwitchVideo(){
    videoEnable = !videoEnable
    if(issipCall){
      if(videoEnable){
        sipcall.muteVideo()
      }else{
        sipcall.unmuteVideo()
      }
    }else{
      if(videoEnable){
        VideoCall.muteVideo()
      }else {
        VideoCall.unmuteVideo()
      }
    }
  }

  //注册videoRoom
  function registVideoRoom(LocaStramID){
    localVideoId = LocaStramID
    localStream = LocaStramID;
    
    Janus.init({
      debug: "all",
      callback: function () {
        Roomjanus = new Janus({
          server:janusUrl,
          success: function () {
            Roomjanus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
        success: function(pluginHandle) {
          videoRoomCall = pluginHandle
          $(document).trigger('VideoRoomSuccess');
         
        },
        error: function(error) {
          Janus.error("  -- Error attaching plugin...", error);
          bootbox.alert("Error attaching plugin... " + error);
          exitRoom()
        },
        consentDialog: function(on) {
          if(on) {
          }
        },
        mediaState: function(medium, on) {
          Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
         
        },
        webrtcState: function(on) {
          Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
          if(!on)
          
              return false;
        },
        onmessage: function(msg, jsep) {
          console.log('==============')
          console.log(jsep)

          Janus.debug(" ::: Got a message (publisher) :::");
          Janus.debug(msg);
          var event = msg["videoroom"];
          if(event != undefined && event != null) {
            if(event === "joined") {
              
              myid = msg["id"];
              mypvtid = msg["private_id"];
              
              capture = "desktop";
              shareScreen();
              if (msg["publishers"] != undefined && msg["publishers"] !== null) {
                  var list = msg["publishers"];
                  for(var f in list){
                    var id = list[f]["id"];
                    var display = list[f]["display"];
                    var audio = list[f]["audio_codec"]; 
                    var video = list[f]["video_codec"];    
                    newRemoteFeed(id,display,audio,video);
                  }
              }
        
            }else if(event === "destroyed") {
        
            }else if(event === "event") {
              if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
                var list = msg["publishers"];
                for(var f in list) {
                  var id = list[f]["id"];
                  var display = list[f]["display"];
                  var audio = list[f]["audio_codec"];
                  var video = list[f]["video_codec"];
                  newRemoteFeed(id, display, audio, video);   
                }
              }else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
                var leaving = msg["leaving"];
                var leaveNum = parseInt(msg["leaving"])
                if(remoteList.hasOwnProperty(leaveNum)){
                  Object.keys(remoteList).map((key,index)=>{
                      if(key === leaveNum){
                        var remoteDiv  = document.getElementById("remoteDiv" + index.toString())  
                        
                        remoteDiv.style.display = 'none'
                      }
                  })
        
                  delete remoteList[leaveNum];
                  delete RoomhandleRemote[leaveNum]
                  delete remoteNameList[leaveNum]
                  if(Object.keys(remoteList).length <= 3){
                    remoteView.style.width = "640px"
                  }else{
                    remoteView.style.width = "940px"
                  }
                }
                var remoteFeed = null;
                for(var i=1; i<6; i++) {
                  if(feeds[i] != null && feeds[i] != undefined && feeds[i].rfid == leaving) {
                    remoteFeed = feeds[i];
                    break;
                  }
                }
                if(remoteFeed != null) {
                  feeds[remoteFeed.rfindex] = null;
                  remoteFeed.detach();
                }
        
              }else if(msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                var unpublished = msg["unpublished"];
                var roomUnpublished = parseInt(msg["unpublished"])
                if(remoteList.hasOwnProperty(roomUnpublished)){
                  Object.keys(remoteList).map((key,index)=>{
                    if(key == roomUnpublished){
                      var remoteDiv  = document.getElementById("remoteDiv" + index.toString())   
                        remoteDiv.style.display = 'none'
                    }
                })
                  delete remoteList[roomUnpublished];
                  delete RoomhandleRemote[roomUnpublished]
                  delete remoteNameList[roomUnpublished]
                  let remoteView = document.getElementById("remoteVideoDiv")
                  if(Object.keys(remoteList).length <= 3){
                    remoteView.style.width = "640px"
                  }else{
                    remoteView.style.width = "940px"
                  }
                }
                if(unpublished === 'ok') {
                  // That's us
                  videoRoomCall.hangup();
                  return;
                }
                var remoteFeed = null;
                for(var i=1; i<6; i++) {
                  if(feeds[i] != null && feeds[i] != undefined && feeds[i].rfid == unpublished) {
                    remoteFeed = feeds[i];
                    break;
                  }
                }
                if(remoteFeed != null) {
                  feeds[remoteFeed.rfindex] = null;
                  remoteFeed.detach();
                }
        
              }else if(msg["error"] !== undefined && msg["error"] !== null) {

              }
            }
        
            }
          if(jsep !== undefined && jsep !== null) {
            console.log('***************')
            videoRoomCall.handleRemoteJsep({jsep: jsep});
            var audio = msg["audio_codec"];
            var video = msg["video_codec"];
            console.log('***************')
        
          }
        },
        
        onlocalstream: function(stream) {
          LocalStreamUrl =  stream
          var videoObjc = document.getElementById("Local-Roomstream-video0")
          var remoteDiv  = document.getElementById("LocalVideoDiv") 
          videoObjc.style.display = "block"
          remoteDiv.style.display = 'block'
          Janus.attachMediaStream($("#" + "Local-Roomstream-video0").get(0), stream);
          
          
        },
        onremotestream: function(stream) {
        console.log('===**************===')
        },
        oncleanup: function() {
          Janus.log(" ::: Got a cleanup notification: we are unpublished now :::"); 
        },
        destroyed: function() {
          // window.location.reload();
        }
        }); 
        }
        });
      }
      });    
  
  }
  Object.defineProperties(remoteList, {
    name: {
      configurable: true,
      set: function(newValue) {
        name = newValue;
        
      }
    }
  })


  //处理room中的点击事件
  let remoteDiv0 = document.getElementById("LocalVideoDiv")
  let divClick = document.getElementById('BigVideoID');
  let LocalStreamUrl = null
  remoteDiv0.ondblclick = function(){
    ClickVideoAction("remote-BigVideo",LocalStreamUrl)
  }

  $(document).on('RoomMutAudio', function (ev,code) {
    RoomisMutAudio = code
    if(code == 0){
      Object.keys(remoteList).map((key,index)=>{
        var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString())  
        videoObjc.muted = false
      })
    }else{
      Object.keys(remoteList).map((key,index)=>{
        var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString())  
        videoObjc.muted = true
      })
    }

  })


  //点击预览大图
  function ClickVideoDisplay(number){
    let dictkey = Object.keys(remoteList)[number]
    let noteSteam = remoteList[dictkey]
    ClickVideoAction("remote-BigVideo",noteSteam)
  }

function ClickVideoAction(ID,Stram){

    divClick.style.display = "block"
    Janus.attachMediaStream($("#" + ID).get(0), Stram);
}

divClick.ondblclick = function(e){
  $(document).trigger('ShowBigVideo');
  
}
  function outLine(isLogin) {
    sipRegister = isLogin
    registered = isLogin
  }

// 检查房间是否存在
  function checkRoom(roomID){
    var checkRoom = {"request" : "exists","room" :roomID};
    videoRoomCall.send({"message": checkRoom});
  }

  //创建房间
  function creatRoom(roomID){
    var CreatRoom = {"request" : "create","publishers": 9,"room" : roomID,"is_private":false,"permanent":true,"bitrate": 1024000,
    "opus_fec": true,
};
    videoRoomCall.send({"message": CreatRoom})
  }

  //加入房间
  function joinRoom(room,userName){
    RoomNumber = room
    var register = { "request": "join", "room": room, "ptype": "publisher", "display": userName,"bitrate": 1024000,
    "opus_fec": true,
};
		myusername = userName;
		videoRoomCall.send({"message": register});
  }
  //销毁房间
  function destroyRoom(roomID){
    var CreatRoom = {"videoroom" : "destroyed","room" : roomID};
    videoRoomCall.send({"message": CreatRoom})
  }
  //获取房间列表
  function RoomList(){
      var roomList = {"request":"list"}
      videoRoomCall.send({"message":"CreatRoom"})
  }

    //获取房间内的参与者
  function PartyList(RoomID){
    var list = {"request":"listparticipants","room":RoomID}
    videoRoomCall.send({"message":list})
  }
  let videoMuted = false
  function exitRoom() {
    if(videoRoomCall){
    videoRoomCall.hangup()
    }
    if(Object.keys(remoteList).length > 0){
      videoRoomCall.ChangeLocalStream(false)
    Object.keys(remoteList).map((key,index)=>{
      var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString()) 
      var remoteDiv  = document.getElementById("remoteDiv" + index.toString()) 
      videoObjc.style.display = "none"
      remoteDiv.style.display = 'none'
    })
    
    divClick.style.display = "none"
    remoteList = {}
    RoomhandleRemote = {}
    remoteNameList = {}
    muteVideo = false
    
    Roomjanus.destroy();  
  }
  }
  function publish(){
    var objc = {"request":"unpublish"}
  }

  function getCurrentjsp(){

    return currentJsep;

  }

  function publishOwnFeed(useAudio){
    videoRoomCall.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true },
      simulcast: false,
      success: function(jsep) {
        var publish = { "request": "configure", "audio": useAudio, "video": true };
        videoRoomCall.send({"message": publish, "jsep": jsep});
      },
      error: function(error) {
				Janus.error("WebRTC error:", error);
				if (useAudio) {
					 publishOwnFeed(false);
				} else {

				}
			}
    })
  }

  function publishownFeedCustom(useAudio,videoSend){
    videoRoomCall.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: videoSend },
      simulcast: false,
      success: function(jsep) {
        var publish = { "request": "configure", "audio": useAudio, "video": videoSend };
        videoRoomCall.send({"message": publish, "jsep": jsep});
      },
      error: function(error) {
				Janus.error("WebRTC error:", error);
				if (useAudio) {
					 publishOwnFeed(false);
				} else {
				}
			}
    })
  }



  function unpublishOwnFeed(){
    var unpublish = { "request": "unpublish" };
	  // videoRoomCall.send({"message": unpublish});
  }

  function newRemoteFeed(id, display, audio, video){
    let remoteFeed = null;
    Roomjanus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success:function(pluginHandle) {
            remoteFeed = pluginHandle;
            remoteFeed.simulcastStarted = false;
            var subscribe = { "request": "join", "room": RoomNumber, "ptype": "listener", "feed": id};
            remoteFeed.videoCodec = video;
				    remoteFeed.send({"message": subscribe});
          },
          error:function (error) {

          },
          onmessage: function(msg, jsep) {
            var event = msg["videoroom"];
            if(msg["error"] !== undefined && msg["error"] !== null) {
            }else if(event != undefined && event != null) {
              if(event === "attached") {
                for(var i=1;i<6;i++) {
                  if(feeds[i] === undefined || feeds[i] === null) {
                    feeds[i] = remoteFeed;
                    remoteFeed.rfindex = i;
                    break;
                  }
                }
                remoteFeed.rfid = msg["id"];
                remoteFeed.rfdisplay = msg["display"];
                if(remoteFeed.spinner === undefined || remoteFeed.spinner === null) {

                }else{
                  remoteFeed.spinner.spin();
                }
              }if(event === "event") {
                var substream = msg["substream"];
                var temporal = msg["temporal"];
                if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                  if(!remoteFeed.simulcastStarted) {
                    remoteFeed.simulcastStarted = true;
                  }
                }
              }else{

              }

            }
            if(jsep !== undefined && jsep !== null) {
              remoteFeed.createAnswer({
                jsep: jsep,
                media: { audioSend: false, videoSend: false },
                success: function(jsep) {
                  var body = { "request": "start", "room": RoomNumber };
                  remoteFeed.send({"message": body, "jsep": jsep});
                },
                error: function (error) { 
                }
              });
            }
          },
          webrtcState: function(on) {
            Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
          },
          onlocalstream: function(stream) {
            // The subscriber stream is recvonly, we don't expect anything here
          },
          
          onremotestream: function(stream) {
            if (display == myusername){
              return;
            }  
            if(remoteList.hasOwnProperty(id)){
              
              
            }
            remoteList[id] = stream;
            RoomhandleRemote[id] = remoteFeed
            remoteNameList[id] = display
            
            if(Object.keys(remoteList).length !== 0){
              let remoteView = document.getElementById("remoteVideoDiv")
              if(Object.keys(remoteList).length <= 3){
                remoteView.style.width = "640px"
              }else{
                remoteView.style.width = "940px"
              }
              Object.keys(remoteList).map((key,index)=>{
                if(index > 7){
                  return;
                }
                let noteSteam = remoteList[key]
                var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString())
                var remoteObjct = document.getElementById("RemoteName" + index.toString())
                var remoteDiv  = document.getElementById("remoteDiv" + index.toString()) 
                var RemoteName = remoteNameList[key]
                remoteObjct.innerText = RemoteName
                videoObjc.style.display = "block"
                remoteDiv.style.display = 'block'
                videoObjc.muted = false
                Janus.attachMediaStream($("#" + 'remote-Roomstream-video' + index.toString()).get(0), noteSteam);
                $(document).trigger('RoomMutAudio',RoomisMutAudio);
              })
            }
          },
          oncleanup: function() {

          }

        });  
  }

  

  $(document).on('RoomVideomuted', function (ev) {
    if(Object.keys(remoteList).length > 0){
      Object.keys(remoteList).map((key,index)=>{
        var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString()) 
        var remoteDiv  = document.getElementById("remoteDiv" + index.toString()) 
        videoObjc.style.display = "none"
        remoteDiv.style.display = 'none'
      });
    }

    if(Object.keys(remoteList).length !== 0){
      let remoteView = document.getElementById("remoteVideoDiv")
      if(Object.keys(remoteList).length <= 3){
        remoteView.style.width = "640px"
      }else{
        remoteView.style.width = "940px"
      }
      Object.keys(remoteList).map((key,index)=>{
        if(index > 7){
          return;
        }
        let noteSteam = remoteList[key]
        var audioTracks = noteSteam.getAudioTracks();
        var videoTracks = noteSteam.getVideoTracks();
        var videoObjc = document.getElementById("remote-Roomstream-video" + index.toString())
        var remoteObjct = document.getElementById("RemoteName" + index.toString())
        var remoteDiv  = document.getElementById("remoteDiv" + index.toString()) 
        var RemoteName = remoteNameList[key]
        remoteObjct.innerText = RemoteName
        videoObjc.style.display = "block"
        remoteDiv.style.display = 'block'
        videoObjc.muted = false
        Janus.attachMediaStream($("#" + 'remote-Roomstream-video' + index.toString()).get(0), noteSteam);
      })
    }

  })

  //Room声音的开关
  function mut() {  
    var muted = videoRoomCall.isAudioMuted();
    if(muted){
      videoRoomCall.unmuteAudio();
    }else{
      videoRoomCall.muteAudio();
    }
  }

  //关闭房间的视频
  function RoommutVideo() {  
    videoMuted = !videoMuted
    if(videoMuted){
      videoRoomCall.muteVideo();
    }else{
      videoRoomCall.unmuteVideo();
    }
  }


  //观看直播
  function watchLive(callbackdata){
    if(!Streaming){
      janus.attach({
          plugin: "janus.plugin.streaming",
          opaqueId: opaqueId,
          success:function(pluginHandle){
            Streaming = pluginHandle
            updateStreamsList(function callback(data){
              callbackdata(data)
            })
          },
          error: function(error) {
            Janus.error("  -- Error attaching plugin... ", error);
            bootbox.alert("Error attaching plugin... " + error);
            Streaming = null
          },
          onmessage:function(msg,jsep){
            console.log('====watch===')
            console.log(msg)
            console.log('====watch===')
            var result = msg["result"]; 
            if(result !== null && result !== undefined) { 
              if(result["status"] !== undefined && result["status"] !== null) {
                var status = result["status"];
                if(status === 'starting'){
                  $(document).trigger('starting');
                }else if(status === 'started'){
                  $(document).trigger('started');
                }else if(status === 'stopped'){
                  $(document).trigger('stopped');
                  stopStream();
                }
              } else if(msg["streaming"] === "event") {
                  var substream = result["substream"];
                  var temporal = result["temporal"];
                  if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {

                  }

                    var spatial = result["spatial_layer"];
                    temporal = result["temporal_layer"];
                    
              }

            }else if(msg["error"] !== undefined && msg["error"] !== null) {
              $(document).trigger('watcherror',[msg["error"]]);
                stopStream();
                return;
            }
            if(jsep !== undefined && jsep !== null) {
              Streaming.createAnswer({
                jsep: jsep,
                media: { audioSend: false, videoSend: false },
                success: function(jsep) {
                  var body = { "request": "start" };
                  Streaming.send({"message": body, "jsep": jsep});

                },error: function(error) {
                  Janus.error("WebRTC error:", error);
                  bootbox.alert("WebRTC error... " + JSON.stringify(error));
                }
              })
            }
          },
          onremotestream: function(stream) {
            var addButtons = false;
            var videoTracks = stream.getVideoTracks();
            Janus.attachMediaStream($('#watchRemoteVideo').get(0), stream);
            
          },oncleanup: function() {
            // Streaming = null
          },
      })
    }else{
      updateStreamsList(function callback(data){
        callbackdata(data)
      })
    }
  }

  //获取直播列表
  function updateStreamsList(callBack){
    var body = { "request": "list" };
    Streaming.send({"message": body, success: function(result) {
      if(result === null || result === undefined) {
        bootbox.alert("Got no response to our query for available streams");
        return;
      }
      if(result["list"] !== undefined && result["list"] !== null) {
        var list = result["list"];
        Janus.log("Got a list of available streams");
        Janus.debug(list);
        callBack(list)
      }
    }
  })
}

//开始观看直播
function startStream(ID){
  if(Streaming){
    var body = { "request": "watch",
    "offer_audio":true,
    "offer_video":true,
    "pin":"1234",
    id: parseInt(ID) 
  
  };
    Streaming.send({"message": body});
  }else{
    watchLive(function callback(back){
      var body = { "request": "watch", id: parseInt(ID) };
      Streaming.send({"message": body});
    })
  } 
}
//结束观看退出房间
function stopStream(){
  var body = { "request": "stop" };
	Streaming.send({"message": body});
	Streaming.hangup();
}


// 屏幕共享
function preShareScreen(ScreenShare,isVideoCall){
  if(!Janus.isExtensionEnabled()) {
    alert("You're using Chrome but don't have the screensharing extension installed: click <b><a href='https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj' target='_blank'>here</a></b> to do so", function() {
			window.location.reload();
		});
		return; 
  }

  if(!isVideoCall){
    if(ScreenShare){
      videoRoomCall.ChangeLocalStream(false)
      capture = "screen";
    shareScreen(false);
    }else{
      videoRoomCall.ChangeLocalStream(true)
      capture = "desktop";
      shareScreen(false);
    }
  }else{
    if(ScreenShare){
      VideoCall.ChangeLocalStream(false)
      capture = "screen";
    shareScreen(true);
    }else{
      VideoCall.ChangeLocalStream(true)
      capture = "desktop";
      shareScreen(true);
    }
  }
 
  
}

function shareScreen(isVideoCall){
  if(isVideoCall){
    VideoCall.muteVideo()
    VideoCall.createOffer(
      {
        media: { video: capture, audioSend: true, videoRecv: false},	// Screen sharing Publishers are sendonly
        success: function(jsep) {
          Janus.debug("Got publisher SDP!");
          Janus.debug(jsep);
          var publish = { "request": "configure", "audio": true, "video": true };
          VideoCall.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          // Janus.error("WebRTC error:", error);
          // bootbox.alert("WebRTC error... " + JSON.stringify(error));
        }
      });
  }else{
    videoRoomCall.createOffer(
      {
        media: { video: capture, audioSend: true, videoRecv: false},	// Screen sharing Publishers are sendonly
        success: function(jsep) {
          Janus.debug("Got publisher SDP!");
          Janus.debug(jsep);
          var publish = { "request": "configure", "audio": true, "video": true };
          videoRoomCall.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          // Janus.error("WebRTC error:", error);
          // bootbox.alert("WebRTC error... " + JSON.stringify(error));
        }
      });
  }
  
}











  function initHtmlTag(remote_video, remote_audio, local_video) {
    localStream = local_video;
    remoteStreamAudio = remote_audio;
    remoteStreamVideo = remote_video;
  }
  //获取呼叫错误信息
  function getCallErroResult(errorBack){
    return errorBack(callErrorresult);
  }


//   //获取消息的接口
// function getWebRTCCallInfo(callBack){
//   getStats(VideoCall.getPeerconnection(),function(message){
//     callBack(message)
//   })
// }


  function getVideoCall(){
    return VideoCall.getPeerconnection();
  }


  return {
    call: call,
    login: login,
    logout: logout,
    answer: answer,
    hangup: hangup,
    initAndLogin: initAndLogin,
    getCounterpartNum: getCounterpartNum,
    SwitchAudio:SwitchAudio,
    SDKSwitchAudio:SDKSwitchAudio,
    SwitchVideo:SwitchVideo,
    initHtmlTag: initHtmlTag,
    getCommingCall:getCommingCall,
    decline:decline,
    getCallErroResult:getCallErroResult,
    getCurrentjsp:getCurrentjsp,
    AllOpen:AllOpen,
    registVideoRoom:registVideoRoom,
    joinRoom:joinRoom,
    mut:mut,
    unpublishOwnFeed:unpublishOwnFeed,
    publishOwnFeed:publishOwnFeed,
    creatRoom:creatRoom,
    checkRoom:checkRoom,
    RoomList:RoomList,
    PartyList:PartyList,
    destroyRoom:destroyRoom,
    exitRoom:exitRoom,
    outLine:outLine,
    ReloadDevice:ReloadDevice,
    getVideoCall:getVideoCall,
    publishownFeedCustom:publishownFeedCustom,
    RoommutVideo:RoommutVideo,
    ClickVideoDisplay:ClickVideoDisplay,
    refreshLogOut:refreshLogOut,
    watchLive:watchLive,
    startStream:startStream,
    stopStream:stopStream,
    updateStreamsList:updateStreamsList,
    preShareScreen:preShareScreen

    // getWebRTCCallInfo:getWebRTCCallInfo,
  };

})();
