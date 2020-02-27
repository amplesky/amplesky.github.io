$(function () {
  var $call = $('#call-to'),
      shift = false,
      capslock = false;
    // Download by http://www.codefans.net
    $('#keyboard li').click(function(){
      var $this = $(this),
        character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
      
      // Shift keys
      if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
        $('.letter').toggleClass('uppercase');
        $('.symbol span').toggle();
        
        shift = (shift === true) ? false : true;
        capslock = false;
        return false;
      }
      
      // Caps lock
      if ($this.hasClass('capslock')) {
        $('.letter').toggleClass('uppercase');
        capslock = true;
        return false;
      }
      
      // Delete
      if ($this.hasClass('delete')) {
        var html = $call.html();
        
        $call.html(html.substr(0, html.length - 1));
        return false;
      }
      
      // Special characters
      if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
      if ($this.hasClass('space')) character = ' ';
      if ($this.hasClass('tab')) character = "\t";
      if ($this.hasClass('return')) character = "\n";
      
      // Uppercase letter
      if ($this.hasClass('uppercase')) character = character.toUpperCase();
      
      // Remove shift once a key is clicked.
      if (shift === true) {
        $('.symbol span').toggle();
        if (capslock === false) $('.letter').toggleClass('uppercase');
        
        shift = false;
      }
      
      // Add the character
      $call.html($call.html() + character);
    });

  let netstate = true
  let isotherPage = false
    let accountobject = document.getElementById('Account')
    let serverobject = document.getElementById('MCu')
    let gateobjct = document.getElementById('GateWay-ip')
    let passObject = document.getElementById('passward')
    getLogins(function number(name,pasnum,serv,gate){
      if (name != null || serv != null  || gate != null) {
        accountobject.value = name;
        serverobject.value = serv;
        gateobjct.value = gate;
        passObject.value = pasnum;
      }
    })

  var LoginSucess = false
  $(document).on('registered', function (ev) {
    // let serverValue =  $('#MCu').val().trim()
    // let GateWayValue = $('#GateWay-ip').val().trim()
    // let nameValue =  $('#Account').val().trim()
    // isUsedLoginOut = false
    //       netstate = true
    //       isCanLogin = false
    //       NetAdress.innerText = "网关:" + GateWayValue
    //       serverAdress.innerText = '服务器:' + serverValue
    //       LoginSucess = true;
    //       logonece = true
    //       if(!isclose){
    //         isclose = true
    //         showOrHiden(1)
    //         isotherPage = false
    //       }
    //       if(LoginTime){
    //         clearInterval(LoginTime);
    //       }
    //       console.log('====775=====')
    //       OwnUserobject.innerText = nameValue
    //       UserName = nameValue
    //       LoginStatues.style.background = "green"
  });

  $(document).on('unregistered', function (ev) {
    $('#output-lbl').text('Unregistered');
  });

  $(document).on('calling', function (ev) {
   
    $('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
  });

  var isVideoCall = false;
  var commName ;
  let showTime = document.getElementById("sid");
  let callVideoState = document.getElementById("state");
  let comminobject = document.getElementById('CommingName');
  let commingType = document.getElementById('commingType');
  let LoginStatues = document.getElementById('LoginState')
  let serverAdress = document.getElementById('serverAddress')
  let NetAdress = document.getElementById('netAdress')
  let alertText = document.getElementById('alertText')
  let Resolutionobjc = document.getElementById('Resolution')
  let videoText = document.getElementById('VideoText')
  let remoteObject = document.getElementById('remoteVideo')
  let localmut = document.getElementById('localmut')
  let localPublish = document.getElementById('localPublish')
  let localName = document.getElementById('localName')
  let localvideo = document.getElementById('local-stream-video')
  let AnimationLoading = document.getElementById('AnimationLoading')
  let UserName
  let RoomUser= document.getElementById('RoomUser')
  let RoomName = document.getElementById('RoomName');
  var commingCall
  let SwitchSpeaker = false
  var SwitchVideo = false
  var videoAudio = false
  let AudioSpeaker = false
  var isaudio = false
  var isClick = false
  let isclose = false //记录是否关闭call页面,解决长时通话自动断线重连导致通话在返回呼叫页面
  var VideoCallName = document.getElementById('VideoCallName')
  var ListenTime
  var areadyReLogin = false;

  //标志是否有mic
  let isAudioenabel = false
  //标志是否有camer
  let isVideoenabel = false
  //标志meet是否可以使用
  let isMeetingEn = false

  $(document).on('incomingcall', function (ev, from) {
    webrtcPhone.initHtmlTag("remote-stream-video", "remote-stream-audio", "local-stream-video")
    commingCall = 1;  
    isotherPage = true
    webrtcPhone.getCommingCall(function(callBack){
      comminobject.innerText = callBack
      commName = callBack
      VideoCallName.innerText = callBack;
    })
    let jsp =  webrtcPhone.getCurrentjsp()
    if ((jsp.sdp.indexOf("m=video ") > -1)) {
      commingType.innerText = "视频通话..."
    }else{
      commingType.innerText = "语音通话..."
    }
    remoteObject.style.height = '68%'
    remoteObject.style.marginTop = '100px'
    //根据获取到的默认设置值进行自动接听事件
      let setinfo = getSetInfo()
      let accept = getAccept()
      if (accept == 1) {
        if (parseInt(setinfo) == 1) {
          showTime.innerText = "正在接通..."
          webrtcPhone.answer(function (jsp){
            isVideoCall = (jsp.sdp.indexOf("m=video ") > -1);
          });
        }else{
          $('.CommingCall').show(); 
          showPageWithIndex(4)
        }
      }else{
        $('.CommingCall').show(); 
        showPageWithIndex(4)
      }
  });
  $("#comminghungUp").click(function () {
    webrtcPhone.decline()
    $('.CommingCall').hide(); 
  })

  $("#commingAnwer").click(function () {
    showTime.innerText = "正在接通..."
    
    webrtcPhone.answer(function (jsp){
        isVideoCall = (jsp.sdp.indexOf("m=video ") > -1);
      });
    })

  $(document).on('callError', function (ev) {
    if (LoginSucess) {
      webrtcPhone.hangup() 
      showPageWithIndex(1)
      isotherPage = false
    }
  })

  let isUsedLoginOut = false
  $(document).on('netError',function (ev) {
    isCanCall(false,false)
    LoginStatues.style.background = "gray"
    netstate = false
    isCanLogin = true
    // setTimeout(f, 5000);
    function f(){
      if (!isUsedLoginOut) {
        webrtcPhone.logout()  
        isUsedLoginOut = true
      }
    }

    $('.alertVC').show()
    alertText.innerText = "与服务器断开连接"
    setTimeout(() => {
      $('.alertVC').hide() 
    }, 1000);

    if(!areadyReLogin){
      webrtcPhone.logout()
      webrtcPhone.outLine(false)
      ReloadAction()
    }

    
  })

  var Shownum = 0
  $(document).on('callaccepted', function (ev) {
    localvideo.style.display = "block"
    AnimationLoading.style.display = 'block'
    $('.CommingCall').hide();
    $('#callName').html(commName);
    $('#hangup-btn').removeAttr('disabled');
    $('#output-lbl').text('...in conversation with ' + webrtcPhone.getCounterpartNum());
    
    let jsp =  webrtcPhone.getCurrentjsp
    if(isVideoCall){
      saveAccept(1);
    }

    Shownum = 0;
    if (isVideoCall) {
      let setinfo = getScreenInfo()
      if(setinfo == 1){
        autoAccept()
      }
      showPageWithIndex(3)
    }else{
      showPageWithIndex(2)
    }
    SwitchSpeaker = false;
    SwitchVideo = false;
    videoAudio = false;
    AudioSpeaker = false
    isaudio = false
    let videocontrol = document.getElementById("remote-stream-audio");
    videocontrol.muted = false
    webrtcPhone.AllOpen()
    $('#local-stream-video').show()
    $('#audio-btn').attr('src', './sounds/Audio.png');
    $('#video-btn').attr('src', './sounds/Video.png');
    $('#Speaker-btn').attr('src', './sounds/Speaker.png');
    $('#audioSpeakImage').attr('src', './sounds/Speaker.png');
    $('#audioCallImage').attr('src', './sounds/Audio.png');
    StartTimes()
    setTimeout(() => {
      getStats(webrtcPhone.getVideoCall())    
    }, 2000);
    
  });

  $(document).on('Busy', function (ev) {
    if (!commingCall) {
      alert('对方忙...')
    } 
  })
  let CallMessageTimer
  $(document).on('hangup', function (ev,code,messgae) {
    clearInterval(ListenTime);
    isotherPage = false
    $('.CommingCall').hide();
    showPageWithIndex(1)
    isotherPage = false
    if(code != undefined && messgae != "to BYE"){
      $('.alertVC').show()
      alertText.innerText = messgae
      setTimeout(() => {
        $('.alertVC').hide() 
      }, 1000);
    }else if(code == undefined && messgae == "Remote WebRTC hangup"){
      $('.alertVC').show()
      alertText.innerText = messgae
      setTimeout(() => {
        $('.alertVC').hide() 
      }, 1000);
    }
    CancleTime();
    Shownum ++ 
    if (Shownum == 1) {
    //  alert('通话结束')
    }
    clearInterval(CallMessageTimer)
    $('.MessageVC').hide();
  });

  $('#login-btn').click(function () {
      webrtcPhone.logout()
      Loginaction();
  });

  let isCanLogin = false
  
  $('#OwnUser').click(function () {
    if (isCanLogin) {
      if (confirm('是否重新登录')) {
        webrtcPhone.logout()
        Loginaction();
      }else{
      }
    }
});

//获取当前视频统计信息
function getStats(peer) {
  myGetStats(peer, function (results) {
    for (var i = 0; i < results.length; ++i) {
      var res = results[i];
        console.log(res)
        getCallMessage(res)
    }


    clearInterval(CallMessageTimer)
    CallMessageTimer = setInterval(() => {
      getStats(peer,function(message){
      });
    }, 2000);


   
  });
}



let reLogin = true
let LoginTime
let logonece = false
let GetDeviceSupportTimer
  function Loginaction(){
    let serverValue =  $('#MCu').val().trim()
    let GateWayValue = $('#GateWay-ip').val().trim()
    let nameValue =  $('#Account').val().trim()
    let passNum =  $('#passward').val().trim()
    let calliput = document.getElementById('call-to')
    calliput.value = localStorage.getItem('CallNumber')
    let OwnUserobject = document.getElementById('OwnUser')
    if (serverValue.length > 0 && GateWayValue.length > 0 && nameValue.length > 0 && passNum.length > 0){
      saveLogins(nameValue,passNum,serverValue,GateWayValue)
      webrtcPhone.initAndLogin({
        server: serverValue,
        GateWay: GateWayValue,
        name: nameValue,                
        exten: $('#GateWay-ip').val(),
        password: $('#password').val(),
        audioId: 'remote-stream-audio',
        localVideoId: 'local-stream-video',
        remoteVideoId: 'remote-stream-video'
      }, function(back){
        if (back) {
          areadyReLogin = false
          isUsedLoginOut = false
          netstate = true
          isCanLogin = false
          NetAdress.innerText = "网关:" + GateWayValue
          serverAdress.innerText = '服务器:' + serverValue
          LoginSucess = true;
          logonece = true
          if(!isclose){
            isclose = true
            showPageWithIndex(1)
            isotherPage = false
          }
          if(LoginTime){
            clearInterval(LoginTime);
          }
          OwnUserobject.innerText = nameValue
          UserName = nameValue
          LoginStatues.style.background = "green"
          isCanCall(true,true)
          clearInterval(GetDeviceSupportTimer)
          GetDeviceSupportTimer = setInterval(deviceSupport,10000);
          webrtcPhone.ReloadDevice();          
        }else{
          LoginSucess = false
          // alert('注册失败')
        }
      },function(errorBack){
        console.log(errorBack.substring(0,7))
          if (errorBack.substring(0,8) == 'Username') {
            setTimeout(login, 30000); 
            function login(){
              Loginaction();
            }
          }
          if((errorBack.substring(errorBack.length - 13,errorBack.length) == "doesn't exist") || errorBack.substring(9,errorBack.length) == "不存在"){
  
            showPageWithIndex(1)
            isotherPage = false
          }
            $('.alertVC').show()
            alertText.innerText = errorBack
            setTimeout(() => {
              $('.alertVC').hide() 
            }, 1000);
            if(errorBack.indexOf("Lost connection to the server") != -1){
              
            }
            if(!logonece){
              webrtcPhone.outLine(false)
              ReloadAction()
            }
            if(isotherPage){
              showPageWithIndex(1)
              webrtcPhone.hangup()
              isotherPage = false
            }
      },function(callMessage){
        
      },function(json){

      },function(jsp){

      });
    }else{
      if (nameValue.length == 0) {
        alert('请输入用户名')
      }else if (passNum.length == 0){
        alert('请输入密码')
      }else if(serverValue.length == 0) {
        alert('请输入服务器地址')
      }else if (GateWayValue.length == 0) {
        alert('请输入网关地址')
      }
    }
  }

  $(document).on('Cancle', function (ev) {
    isclose = false
    clearInterval(GetDeviceSupportTimer)
  })
  
  function deviceSupport() {
    webrtcPhone.ReloadDevice()
  }

  function ReloadAction() {
    if(areadyReLogin){
      return
    }

    if(isotherPage){
      showPageWithIndex(1)
      webrtcPhone.hangup()
      isotherPage = false
    }
    if(LoginTime){
      clearInterval(LoginTime);
    }
      areadyReLogin = true
      LoginTime = setInterval(function() {
        webrtcPhone.logout()
        Loginaction() 
        areadyReLogin = true
        $('.alertVC').hide()
      },3000);
  }
  let myVideo = document.getElementById('remote-stream-video')


//监听网络是否连接
window.addEventListener('online',function () {
    webrtcPhone.logout()
    webrtcPhone.outLine(false)
    ReloadAction()
  $('.alertVC').show()
  alertText.innerText = "网络已连接"
  setTimeout(() => {
    $('.alertVC').hide() 
  }, 1000);
})

// //监听网页刷新与关闭
// window.onbeforeunload = function(){
//   var  n  =  window.event.screenX  -  window.screenLeft; 
//         var  b  =  n  >  document.documentElement.scrollWidth-20; 
//         if(b  &&  window.event.clientY  <  0  ||  window.event.altKey){ 
//           webrtcPhone.hangup();
//           webrtcPhone.logout();
//         }else{
//           webrtcPhone.hangup();
//           webrtcPhone.logout();
//       }        
// }

$(document).on('supportedDevices', function (ev,supportedDevices) {
  let audioEn = supportedDevices["audio"]
  let videoEn = supportedDevices["video"]
  if(isotherPage && (!videoEn || !audioEn) && LoginSucess){
    webrtcPhone.hangup()
    showPageWithIndex(1)
    isotherPage = false
    ShowAlertText("检测到丢失视频源,会话结束")
  }
  isCanCall(audioEn,videoEn)
})

function isCanCall(audioEn,videoEn){
  let audioImage = document.getElementById('call-audio-btn')
  let videoImage = document.getElementById('call-audio-video-btn')
  let meetingImage = document.getElementById('Meeting-audio-video-btn')
  if(audioEn && netstate){
    audioImage.style.backgroundColor = "#96c11f"
    isAudioenabel = true
  }else{
    audioImage.style.backgroundColor = "#bbb"
    isAudioenabel = false
  }
  if(videoEn && netstate){
    videoImage.style.backgroundColor = "#96c11f"
    isVideoenabel = true
  }else{
    videoImage.style.backgroundColor = "#bbb"
    isVideoenabel = false
  }
  if(audioEn && videoEn && netstate){
    meetingImage.style.backgroundColor = "#96c11f"
    isMeetingEn = true
  }else{
    meetingImage.style.backgroundColor = "#bbb"
    isMeetingEn = false
  } 
}

function ShowAlertText(text) {
  $('.alertVC').show()
  setTimeout(f, 2000);
  alertText.innerText = text
  function f(){
    $('.alertVC').hide()
  }
}


//监听网络断开
window.addEventListener('offline',function () {
  LoginStatues.style.background = "gray"
  netstate = false
  webrtcPhone.outLine(false)  
  if(isotherPage){
    showPageWithIndex(1)
    webrtcPhone.hangup()
    isotherPage = false
  }   
  isCanCall(false,false)
  $('.alertVC').show()
  alertText.innerText = "网络连接断开"
  setTimeout(() => {
    $('.alertVC').hide() 
  }, 1000);
})


  myVideo.addEventListener('play',function(){
    AnimationLoading.style.display = 'none'
});
let Resotation = document.getElementById('Resolution')

myVideo.addEventListener('playing',function(){
  ListenTime = setInterval(function() {
    Resotation.innerText = '远端分辨率 :' + myVideo.videoWidth+ '×' + myVideo.videoHeight
    
  },1000) 

});

$(document).on('VideoUnmuted', function (ev) {
  AnimationLoading.style.display = 'none'
})

$(document).on('Videomuted', function (ev) {
  AnimationLoading.style.display = 'block'
})
  $('#logout-btn').click(function () {
    webrtcPhone.hangup();
  });

  
  $('#audio-btn').click(function () {
    clickAcion()
    webrtcPhone.SwitchAudio()
    videoAudio = !videoAudio
    if (videoAudio) {
      $('#audio-btn').attr('src', './sounds/CloseAudio.png');
      AlertAction("麦克风关闭")
    }else{
      $('#audio-btn').attr('src', './sounds/Audio.png');
      AlertAction("麦克风打开")
    }
  });
  
  $('#video-btn').click(function () {
    clickAcion()
    webrtcPhone.SwitchVideo()
    SwitchVideo = !SwitchVideo
    if (SwitchVideo) {
      $('#video-btn').attr('src', './sounds/CloseVideo.png');
      $('#local-stream-video').hide()
      AlertAction("视频关闭")
      
    }else{
      $('#local-stream-video').show()
      $('#video-btn').attr('src', './sounds/Video.png');
      AlertAction("视频打开")
    }
  });


  function AlertAction(text) {
    $('.alertVC').show()
    setTimeout(f, 1000);
    alertText.innerText = text
    function f(){
      $('.alertVC').hide()
      
    }
  }


  $('#Speaker-btn').click(function () {
    SwitchSpeaker = !SwitchSpeaker
    clickAcion()
    // let videocontrol = document.getElementById("remote-stream-audio");
    let videocontrol = document.getElementById("remote-stream-audio");
    if (SwitchSpeaker) {
      $('#Speaker-btn').attr('src', './sounds/NoSpeaker.png');
      AlertAction("扬声器关闭")
      videocontrol.muted = true
    }else{
      videocontrol.muted = false
      $('#Speaker-btn').attr('src', './sounds/Speaker.png');
      AlertAction("扬声器打开")
    }
  })

  $('#logout-btn').click(function () {
    webrtcPhone.hangup();
    webrtcPhone.logout();
    
  });

  $('#hangup-btn').click(function () {
    webrtcPhone.hangup();
    showPageWithIndex(1)
    CancleTime()
    Shownum = 1
    isotherPage = false
  });

  $('#answer-btn').click(function () {
    webrtcPhone.answer();
  });
  $('#call-audio-video-btn').click(function () {
    if (!netstate) {
      ShowAlertText("与服务器已断开连接,请刷新重新登录或等待自动登录成功")
      return
    }

    if(!isVideoenabel){
      ShowAlertText("摄像头不可用,请确认摄像头连接状态")
      return
    }

    isotherPage = true
    remoteObject.style.height = '68%'
    remoteObject.style.marginTop = '100px'
    let screenInfo = getScreenInfo()
    if(screenInfo == 1){
      autoAccept()
    }
    saveCallNumber()
    Shownum = 0
    isVideoCall = true;
    var to = $('#call-to').val();
    commingCall = 0
    if (to){
      let type  = ((to.indexOf("@") != -1) || (to.indexOf("+") != -1));
      if(type){
        if((to.indexOf("@") != -1)){
          let Callname = getStr(to,"@")
          let IP = to.split("@")[1];
          VideoCallName.innerText = ("sip:" + Callname + "@" + IP)
        }
        if((to.indexOf("+") != -1)){
          let name = to.split("+")[1];
          VideoCallName.innerText  = 'sip:' + name +'@'+ $('#MCu').val().trim();
        }


        let SpecName;
        if(((to.indexOf("@") != -1) && (to.indexOf("+") != -1))){
          SpecName = to.split("+")[1];
          SpecName = getStr(SpecName,"@")
          let  IP = to.split("@")[1];
          sipUri  = 'sip:' + SpecName +'@'+ IP;
          VideoCallName.innerText  = sipUri
        }

      }else{
        $('#callName').html(to);
        VideoCallName.innerText = to
      }
      webrtcPhone.call(to, true,true,true,true);
      showPageWithIndex(3)
      callVideoState.innerText = '等待接听...'
    }else{
      alert('请输入呼叫号码')
    } 
  });

  let CallNumber ;
  let RoomNnumber ;
  $('#Meeting-audio-video-btn').click(function ()   
  {

  if (!netstate) {
    ShowAlertText("与服务器已断开连接,请刷新重新登录或等待自动登录成功")
  return
}
    if(!isMeetingEn){
      if(!isAudioenabel && !isVideoenabel){
        ShowAlertText("camer和mic必须都可使用才能开启会议")
        return
      }else if(!isAudioenabel && isVideoenabel){
        ShowAlertText("mic不可用")
        return
      }else if(isAudioenabel && !isVideoenabel){
        ShowAlertText("camer不可用")
        return
      }
    }
    isotherPage = true
    CallNumber = $('#call-to').val();
    RoomNnumber = Number(CallNumber)
    saveCallNumber()
    LoginVideoRoom()
    RoomUser.innerText = UserName;
    showPageWithIndex(6)
  })
  
  $(document).on('CreatSuccess', function (ev) {
    webrtcPhone.joinRoom(RoomNnumber,UserName)
    RoomName.innerText = '房间: ' + String(RoomNnumber)
    StartTimes()
  })

  $(document).on('CreatFail', function (ev) {
    alert("创建房间失败,请重试")

  })

  $(document).on('RoomExists', function (ev) {
    webrtcPhone.joinRoom(RoomNnumber,UserName)
    RoomName.innerText = '房间: ' + String(RoomNnumber)
    StartTimes()
  })

  $(document).on('RoomExistsFail', function (ev) {
    webrtcPhone.creatRoom(RoomNnumber)
  })


  $(document).on('VideoRoomSuccess', function (ev) {
    webrtcPhone.checkRoom(RoomNnumber)  
  });


  $('#back_btn').click(function () {
    webrtcPhone.logout();
    showPageWithIndex(0)
  });

  $('#call-audio-btn').click(function () {
    if (!netstate) {
      ShowAlertText("与服务器已断开连接,请刷新重新登录或等待自动登录成功")
    return
  }

  if(!isAudioenabel){
    ShowAlertText("mic不可用,确认连接后在尝试呼叫")
    return;
  }

  isotherPage = true
    saveCallNumber()
    isVideoCall = false;
    Shownum = 0
    commingCall = 0
    var to = $('#call-to').val();
    if (to){
      let type  = ((to.indexOf("@") != -1) || to.indexOf("+") != -1);
      if(type){
        
        if((to.indexOf("@") != -1)){
          let Callname = getStr(to,"@")
          let IP = to.split("@")[1];
          $('#callName').html("sip:" + Callname + "@" + IP)
        }
        if((to.indexOf("+") != -1)){
          let name = to.split("+")[1];
          $('#callName').html('sip:' + name +'@'+ $('#MCu').val().trim());
        }
        let SpecName;
        if(((to.indexOf("@") != -1) && (to.indexOf("+") != -1))){
          SpecName = to.split("+")[1];
          SpecName = getStr(SpecName,"@")
          let  IP = to.split("@")[1];
          sipUri  = 'sip:' + SpecName +'@'+ IP;
          $('#callName').html(sipUri)
        }
      }else{
        $('#callName').html(to);
      }
      showTime.innerText = "等待接听..."
      webrtcPhone.call(to, false,false,true,true);
      showPageWithIndex(2)
    }else{
      alert('请输入呼叫号码')
    }
  });

  $("#audioCallImage").click(function () {
    isaudio = !isaudio
    if (isaudio) {
      $('#audioCallImage').attr('src', './sounds/CloseAudio.png');
      AlertAction("麦克风关闭")
    }else{
      $('#audioCallImage').attr('src', './sounds/Audio.png');
      AlertAction("麦克风打开")
    }
    webrtcPhone.SwitchAudio()
  })
  
  
  $("#audioSpeakImage").click(function () {
    let videocontrol = document.getElementById("remote-stream-audio");
    AudioSpeaker = !AudioSpeaker
    if (AudioSpeaker) {
      $('#audioSpeakImage').attr('src', './sounds/NoSpeaker.png');
      AlertAction("扬声器关闭")
      videocontrol.muted = true
    }else{
      $('#audioSpeakImage').attr('src', './sounds/Speaker.png');
      AlertAction("扬声器打开")
      videocontrol.muted = false
    } 
  })
  
  let AudioText = ""
  let VideoText = ""
  let messageText = document.getElementById('messageText')
  function getCallMessage(message){
  
  if(message["googContentType"] == "realtime"){
  
    if(commingCall){
      let inputwidth =  message['googFrameWidthInput']
      let outPutwidth =  message['googFrameWidthSent']
      let packetsLost = message['packetsLost']
      let googRtt = message['googRtt']
  
      let googHasEnteredLowResolution =  message['googHasEnteredLowResolution']
      let googEncodeUsagePercent =  message['googEncodeUsagePercent']
      let googCpuLimitedResolution = message['googCpuLimitedResolution']
      let googBandwidthLimitedResolution = message['googBandwidthLimitedResolution']
  
      let googFrameHeightInput =  message['googFrameHeightInput']
      let googAvgEncodeMs =  message['googAvgEncodeMs']
      let googNacksReceived = message['googNacksReceived']
      let googTrackId = message['googTrackId']
  
      let framesEncoded =  message['framesEncoded']
      let codecImplementationName =  message['codecImplementationName']
      let transportId = message['transportId']
      let mediaType = message['mediaType']
  
      let googFrameHeightSent =  message['googFrameHeightSent']
      let googFrameRateSent =  message['googFrameRateSent']
      let googCodecName = message['googCodecName']
      let hugeFramesSent = message['hugeFramesSent']
      let googFrameRateInput = message['googFrameRateInput']
  
      let qpSum =  message['qpSum']
      let googPlisReceived =  message['googPlisReceived']
      let googAdaptationChanges = message['googAdaptationChanges']
      let id = message['id']
  
  
      let googFirsReceived =  message['googFirsReceived']
      let packetsSent =  message['packetsSent']
      let bytesSent = message['bytesSent']
      let ssrc = message['ssrc']
  
      VideoText = "\n\nVideo\n"+
        "接收视频宽: " + inputwidth + "\n" +
        "接收视频高: " + googFrameHeightInput + "\n" +
        "发送视频宽: " + outPutwidth + "\n" +
        "发送视频高: " + googFrameHeightSent + "\n" +
        "编码器类型: " + googCodecName + "\n" +
        "总编码帧数: " + framesEncoded + "\n" +
        "发包数: " + packetsSent + "\n" +
        "发送字节数: " + bytesSent + "kb" + "\n" +
        "接收比特率: " + googFrameRateInput + "\n" +
        "发送端帧率: " + googFrameRateSent + "\n"+
        "初始帧率: " + googFrameRateInput + "\n"+
        "累积丢包数: " + packetsLost + "\n"+
        "数据往返延时: " + googRtt + " s"+ "\n"+
        "Qp帧数量: " + qpSum + "\n"+
        "cpu负载变化次数: " + googAdaptationChanges + "\n"+
        "编码耗时: " + googAvgEncodeMs + "\n"+
        "编码效率: " + googEncodeUsagePercent + "\n"+
        "关键帧请求数量: " + googPlisReceived + "\n"+
        "重传包数量: " + googNacksReceived + "\n\n" 
      }else{
  
        let googFrameWidthReceived =  message['googFrameWidthReceived']
        let googFrameHeightReceived =  message['googFrameHeightReceived']
        let googCodecName = message['googCodecName']
        let codecImplementationName = message['codecImplementationName']
  
        let googInterframeDelayMax =  message['googInterframeDelayMax']
        let googFirstFrameReceivedToDecodedMs =  message['googFirstFrameReceivedToDecodedMs']
        let framesDecoded = message['framesDecoded']
        let packetsReceived = message['packetsReceived']
  
  
        let bytesReceived =  message['bytesReceived']
        let googFrameRateReceived = message['googFrameRateReceived']
        let googFrameRateOutput = message['googFrameRateOutput']
  
  
        let packetsLost =  message['packetsLost']
        let googPlisSent =  message['googPlisSent']
        let qpSum = message['qpSum']
        let googRenderDelayMs = message['googRenderDelayMs']
        let googCurrentDelayMs = message['googCurrentDelayMs']
  
  
        let googMinPlayoutDelayMs =  message['googMinPlayoutDelayMs']
        let googJitterBufferMs =  message['googJitterBufferMs']
  
        VideoText = "\n\nVideo\n"+
        "接收视频宽: " + googFrameWidthReceived + "\n" +
        "接收视频高: " + googFrameHeightReceived + "\n" +
        "编码器类型: " + googCodecName + "\n" +
        "编码器名称: " + codecImplementationName + "\n" +
        "最大延时" +googInterframeDelayMax + "\n" +
        "首针数据延时" +googFirstFrameReceivedToDecodedMs + " ms" +"\n" +
        "总解码包数: " + framesDecoded + "\n" +
        "收包数: " + packetsReceived + "\n" +
        "接收字节数: " + bytesReceived + "kb" + "\n" +
        "接收比特率: " + googFrameRateReceived + "\n" +
        "发送端帧率: " + googFrameRateOutput + "\n"+
        "累积丢包数: " + packetsLost + "\n"+
        "关键帧请求数量: " + googPlisSent + "\n"+
        "Qp帧数量: " + qpSum + "\n"+
        "延时补偿: " + googRenderDelayMs + " ms" +"\n"+
        "数据往返延时: " + googCurrentDelayMs + " ms" + "\n"+
        "播放延时: " +  googMinPlayoutDelayMs + " ms" + "\n"+
        "视频抖动: " + googJitterBufferMs + " ms" +"\n\n"
      }
    }


    let AudiogoogCodecName;
    if(parseInt(message["audioInputLevel"]) > 0){
      AudiogoogCodecName = message['googCodecName']
      let AudioaudioInputLevel = message["audioInputLevel"]
      let AudiopacketsLost = message['packetsLost']
      let AudiototalSamplesDuration = message['totalSamplesDuration']
      let AudiogoogEchoCancellationReturnLoss = message['googEchoCancellationReturnLoss']
      let AudiototalAudioEnergy = message['totalAudioEnergy']
      let AudiogoogJitterReceived = message['googJitterReceived']
      let AudiopacketsSent = message['packetsSent']
      let AudiobytesSent = message['bytesSent']
      let googResidualEchoLikelihood = message["googResidualEchoLikelihood"]
      AudioText = "\nAudio\n"+
      "编码器类型: " + AudiogoogCodecName + "\n" +
      "发包数: " + AudiopacketsSent + "\n" +
      "发送字节数: " + AudiobytesSent + "kb" + "\n" +
      "音频抖动: " + AudiogoogJitterReceived + "\n"+
      "采集音频能量: " + AudioaudioInputLevel + "\n" +
      "回声抑制: " + googResidualEchoLikelihood + "\n"+
      "累计丢包数: " + AudiopacketsLost + "\n"
      
    }
    // (jsp.sdp.indexOf("m=video ") > -1)
  
    messageText.innerText = AudioText + VideoText
    
  }  

    

});

//有点击事件后暂停定时器
var Clicknum = 0
var Clicktime;
function clickAcion() {
  if(isScreen){
    isClick = true
    Clicknum = 0
    clearInterval(Clicktime);
    Clicktime = setInterval(VideoClickTime,1000);
  } 
}

  function VideoClickTime() {
    Clicknum++
    if (Clicknum == 5){
      $("#VideoBottom").animate({bottom:'-210px'});
      clearInterval(Clicktime);
      Clicknum = 0
    }
  }
  

let show = false
function ShowVideoMessage(){
  show = !show
  if(show){
    $('.MessageVC').show();
  }else{
    $('.MessageVC').hide();
  }
  
}



//全屏功能按钮的显示隐藏
let remoteObject = document.getElementById('remoteVideo')
let VideoBottom = document.getElementById('VideoBottom')
let VideoTopDiv = document.getElementById('VideoTopDiv')
var docElm = document.documentElement;
let isScreen = false
// var localObjc= document.getElementById('VideoLocal');
function ScreenClick() {
  isClick = false
  isScreen = !isScreen

  if(docElm.webkitRequestFullScreen){
    docElm.webkitRequestFullScreen(); 
  }else if(docElm.requestFullScreen){
    docElm.requestFullScreen();  
  }else if(docElm.msRequestFullscreen){
    docElm.msRequestFullscreen();  
  }else if(docElm.mozRequestFullScreen){
    docElm.mozRequestFullScreen();
  }
  if (isScreen){
    screenAction(true)
    $('#ScreenImg').attr('src', './sounds/NoScreen.png');
    setTimeout(f, 5000);
  function f(){
    if(!isClick &&isScreen){
    $("#VideoBottom").animate({bottom:'-210px'});
    $("#VideoTopDiv").animate({top:'-210px'});
    $("#VideoLocal").animate({top:'-210px'});
    $("#screenButton").animate({top:'-210px'});
    }
  }
  }else{
    screenAction(false)
    $('#ScreenImg').attr('src', './sounds/Screen.png');
    $("#VideoBottom").animate({bottom:'0px'});
    $("#VideoLocal").animate({bottom:'0px'});
    $("#VideoTopDiv").animate({top:'10px'});
    $("#screenButton").animate({top:'30px'});

    if (document.exitFullscreen) { 
      document.exitFullscreen(); 
  } else if (document.msExitFullscreen) { 
    document.msExitFullscreen(); 
  } else if (document.mozCancelFullScreen) { 
    document.mozCancelFullScreen(); 
  } else if (document.webkitCancelFullScreen) { 
    document.webkitCancelFullScreen(); 
  }
    clearInterval(Clicktime);
  }
  
}


function autoAccept(){
  enterFullScreen()
  isScreen= false
  ScreenClick()
}

function enterFullScreen () {
  var el = document.documentElement;
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;      
  if(typeof rfs != "undefined" && rfs) {
      rfs.call(el);
  };         
  return;
}

//双击显示功能按钮
function doubleClick() {
  isClick = false
  if(isScreen){
    $("#VideoBottom").animate({bottom:'0px'});
    $("#VideoLocal").animate({bottom:'0px'});
    $("#VideoTopDiv").animate({top:'0px'});
    $("#screenButton").animate({top:'30px'});
    setTimeout(f, 5000);
    function f(){
      if(isScreen &&  !isClick){
      $("#VideoBottom").animate({bottom:'-210px'});
      $("#VideoLocal").animate({top:'-210px'});
      $("#VideoTopDiv").animate({top:'-210px'});
      $("#screenButton").animate({top:'-210px'});
      }
    }
  }
}

function screenAction(params) {
  var docElm = document.documentElement;

  if(params){
    remoteObject.style.height = '100%'
    remoteObject.style.marginTop = '0'
    if(docElm.webkitRequestFullScreen){
      docElm.webkitRequestFullScreen(); 
    }else if(docElm.requestFullScreen){
      docElm.requestFullScreen();  
    }else if(docElm.msRequestFullscreen){
      docElm.msRequestFullscreen();  
    }else if(docElm.mozRequestFullScreen){
      docElm.mozRequestFullScreen();
    }
    
  }else{
    remoteObject.style.height = '68%'
    remoteObject.style.marginTop = '100px'
    if (docElm.exitFullscreen) { 
      docElm.exitFullscreen(); 
  } else if (docElm.msExitFullscreen) { 
    docElm.msExitFullscreen(); 
  } else if (docElm.mozCancelFullScreen) { 
    docElm.mozCancelFullScreen(); 
  } else if (docElm.webkitCancelFullScreen) { 
    docElm.webkitCancelFullScreen(); 
  }
    
  }
}

function myGetStats(peer, callback) {
  if (!!navigator.mozGetUserMedia) {
    peer.getStats(
      function (res) {
        var items = [];
        res.forEach(function (result) {
          items.push(result);
        });
        callback(items);
      },
      callback
    );
  } else {
    peer.getStats(function (res) {
      var items = [];
      res.result().forEach(function (result) {
        var item = {};
        result.names().forEach(function (name) {
          item[name] = result.stat(name);
        });
        item.id = result.id;
        item.type = result.type;
        item.timestamp = result.timestamp;
        items.push(item);
        
      });
      callback(items);
    });
  }
};

 

  

  // audioInputLevel: "702"
  // packetsLost: "0"
  // googTrackId: "d60acb6a-2c69-4dfa-9011-dc45a4ccb26e"
  // googRtt: "1"
  // googResidualEchoLikelihoodRecentMax: "0.164115"
  // googEchoCancellationReturnLossEnhancement: "0"
  // totalSamplesDuration: "56.44"
  // googCodecName: "opus"
  // transportId: "Channel-audio-1"
  // mediaType: "audio"
  // googEchoCancellationReturnLoss: "-29"
  // googResidualEchoLikelihood: "0.164115"
  // totalAudioEnergy: "12.8964"
  // ssrc: "364482862"
  // googJitterReceived: "1"
  // googTypingNoiseState: "false"
  // packetsSent: "2818"
  // bytesSent: "280703"
  // id: "ssrc_364482862_send"
  // type: "ssrc"


window.addEventListener("resize", function () {
  //根据当前的状态显示图标
  if(!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
     //退出全屏状态。。。
    //  screenAction()
    isScreen = false
    $('#ScreenImg').attr('src', './sounds/Screen.png');
    $("#VideoBottom").animate({bottom:'0px'});
    $("#VideoTopDiv").animate({top:'10px'});
    $("#screenButton").animate({top:'30px'});
    
    $("#VideoLocal").animate({bottom:'0px'});

  if (document.msExitFullscreen) { 
    document.msExitFullscreen(); 
  } else if (document.mozCancelFullScreen) { 
    document.mozCancelFullScreen(); 
  } else if (document.webkitCancelFullScreen) { 
    document.webkitCancelFullScreen(); 
  }
    remoteObject.style.height = '68%'
    remoteObject.style.marginTop = '100px'
  //   if (document.webkitCancelFullScreen) {  
  //     document.webkitCancelFullScreen();   
  // }  
    clearInterval(Clicktime);
  }else{
  //   isScreen = true
  //   $('#ScreenImg').attr('src', './sounds/NoScreen.png');
  //   setTimeout(f, 5000);
  // function f(){
  //   if(!isClick &&isScreen){
  //   $("#VideoBottom").animate({bottom:'-210px'});
  //   $("#VideoLocal").animate({top:'-210px'});
  //   remoteObject.style.height = '100%'
  //   remoteObject.style.marginTop = '0'
  //   }
  // }
  }

});

function getStr(string,str){
  var str_before = string.split(str)[0];
  var str_after = string.split(str)[1];
  if (str_before.length > 0) {
    return str_before
  }else{
    return str_after
  }
}

$("#audioHungImage").click(function () {
  webrtcPhone.hangup()
  showPageWithIndex(1)
  isotherPage = false
  CancleTime()
  Shownum = 1
  
})




function RoombackClick() {
  CancleTime()
  showPageWithIndex(1)
  webrtcPhone.exitRoom();
  isotherPage = false
}
//设置本地摄像头旋转
function SelectCamer(number){
  let one = document.getElementById('Camer0')
  // let two = document.getElementById('Camer1')
  let three = document.getElementById('Camer2')

  switch(number){
    case 0:
      one.src = "./sounds/Select.png"
      // two.src = "./sounds/NoSeleted.png"
      three.src = "./sounds/NoSeleted.png"
      document.getElementsByTagName('body')[0].style.zoom=1
      SetCamerInfo(0)
    break
    case 1:
      one.src = "./sounds/NoSeleted.png"
      // two.src = "./sounds/Select.png"
      three.src = "./sounds/NoSeleted.png"
      document.getElementsByTagName('body')[0].style.zoom=1.3
      SetCamerInfo(1)
    break
    case 2:
      one.src = "./sounds/NoSeleted.png"
      // two.src = "./sounds/NoSeleted.png"
      three.src = "./sounds/Select.png"
      document.getElementsByTagName('body')[0].style.zoom=1.5
      SetCamerInfo(2)
    break
    default:
    break
  }
}

let HomesetType = true
function CallacceptType() {
  HomesetType = false
 let info = getSetInfo()
 let Screeninfo = getScreenInfo()
   let Switch = document.getElementById('onoffswitch')
   let ScreenSwitch = document.getElementById('Screenswitch')
  if(Screeninfo == 1){
    ScreenSwitch.checked = true
  }else{
    ScreenSwitch.checked = false 
  }
   if (parseInt(info) == 1) {
    Switch.checked = true
   }else{
    Switch.checked = false 
   }
    showPageWithIndex(5);
    $('#MCu').attr('disabled','disabled');
    $('#GateWay-ip').attr('disabled','disabled');
    let Setsave = document.getElementById('SetSave') 
    let SetDiv = document.getElementById('SetDiv') 
    SetDiv.innerText = "设置"
    Setsave.innerText = "注销"

    //设置本地摄像头旋转
    let camerNum = getCamerInfo()
    if(camerNum == null){
      camerNum = 0
    }
    SelectCamer(parseInt(camerNum))    
}


let camerNum = getCamerInfo()
if(camerNum == null){
  camerNum = 0
}
SelectCamer(parseInt(camerNum))        

//设置页保存事件
function setSaveClick() {
  if(HomesetType){
    $('.alertVC').show()
    setTimeout(f, 1000);
    alertText.innerText = "保存成功"
    function f(){
      $('.alertVC').hide()
    }
    saveIPInfo()
  }else{

    webrtcPhone.logout()
    showPageWithIndex(0)
    isclose = false
    $(document).trigger('Cancle');
  }
  
}


function backClick(){
  if(HomesetType){
    showPageWithIndex(0)
  }else{
    showPageWithIndex(1)
  }
  
}

//接听类型设置
function acceptType(){
  HomesetType = true
   let info = getSetInfo()
   let ScreenInfo = getScreenInfo()
   let Switch = document.getElementById('onoffswitch')
   let ScreenSwitch = document.getElementById('Screenswitch')
   if (parseInt(info) == 1) {
    Switch.checked = true
   }else{
    Switch.checked = false 
   }
   if (ScreenInfo == 1) {
    ScreenSwitch.checked = true
   }else{
    ScreenSwitch.checked = false 
   }

   showPageWithIndex(5);
    $('#MCu').removeAttr('disabled');
    $('#GateWay-ip').removeAttr('disabled');
    let Setsave = document.getElementById('SetSave') 
    let SetDiv = document.getElementById('SetDiv') 
    SetDiv.innerText = "设置"
    Setsave.innerText = "保存"

    //设置本地摄像头旋转
    let camerNumber = getCamerInfo()
    if(camerNumber == null){
      camerNumber = 0
    }
    SelectCamer(parseInt(camerNumber))
}

$("#onoffswitch").on('click', function(){
  clickSwitch()
});

$("#Screenswitch").on('click', function(){
  if ($("#Screenswitch").is(':checked')) {
    console.log("在ON的状态下");
    saveScreenInfo(1)

  } else {
    console.log("在OFF的状态下");
    saveScreenInfo(0)
  }
});

var clickSwitch = function() {
  if ($("#onoffswitch").is(':checked')) {
    console.log("在ON的状态下");
    saveSetInfo(1)

  } else {
    console.log("在OFF的状态下");
    saveSetInfo(0)
  }
};
//高级设置
let setState = false
function loginSetting(){
  setState = !setState
  let setting = document.getElementById('setting')
  let setdiv = document.getElementById('set-input')
  if (setState) {
    setting.innerText = "简单设置" 
    setdiv.style.display = 'block'
  }else{
    setdiv.style.display = 'none'
    setting.innerText = "高级设置" 
  }  
}

//影藏或显示视图
function showPageWithIndex(indexNum){
  $('.MessageVC').hide();
  switch(indexNum){
    case 0:
        $('.index').show();
        $('.CallVC').hide();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').hide();
        $('.SetVC').hide();
        $('.VideoRoom').hide();
      break;
    case 1:
        isotherPage = true
        $('.index').hide();
        $('.CallVC').show();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').hide();
        $('.VideoRoom').hide();
        $('.SetVC').hide();
        
      break;
    case 2:
        isotherPage = true
        $('.index').hide();
        $('.CallVC').hide();
        $('.AudioCallVC').show();
        $('.VideoCallVC').hide();
        $('.VideoRoom').hide();
      break;
    case 3:
        isotherPage = true
        $('.index').hide();
        $('.CallVC').hide();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').show();
        $('.VideoRoom').hide();

        //设置本地摄像头旋转
        // let Local = document.getElementById("VideoLocal")
        // let camerInfo = getCamerInfo()
        // switch(parseInt(camerInfo)){
        //   case 0:
        //     Local.style.transform = 'rotate(0deg)'
        //     break;
        //   case 1:
        //     Local.style.transform = 'rotate(90deg)'
        //     break;
        //   case 2:
        //     Local.style.transform = 'rotate(180deg)'
        //     break;    
        // }
        
       break;     
    case 4:
        $('.index').hide();
        $('.CallVC').hide();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').hide();   
        $('.VideoRoom').hide();
      break;     
    case 5:
        $('.index').hide();
        $('.CallVC').hide();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').hide();  
        $('.SetVC').show();  
        $('.VideoRoom').hide();
        break;
     case 6:
        $('.index').hide();
        $('.CallVC').hide();
        $('.AudioCallVC').hide();
        $('.VideoCallVC').hide();  
        $('.SetVC').hide();  
        $('.VideoRoom').show(); 
        isotherPage = true
        break
    default:
    break;

  }
}

function LoginVideoRoom(){
  // webrtcPhone.initHtmlTag("remote-Roomstream-video", "remote-Roomstream-audio", "local-Roomstream-video")
  webrtcPhone.registVideoRoom('local-Roomstream-video')
}

//Room本地音频开关
let localaudio = false
function localMutClick() {
  localaudio = !localaudio
  if(localaudio){
    localmut.innerText = "unMut"
  }else{
    localmut.innerText = "mut"
  }
  webrtcPhone.mut()
}

//Room本地publish
let localVideo = false
let localRoomstreamvideo = document.getElementById('local-Roomstream-video')
function localPublishClick() {
  localVideo = !localVideo
  if(localVideo){
    localPublish.innerText = 'unpublisher'
    localRoomstreamvideo.style.display = 'none'
    webrtcPhone.unpublishOwnFeed()
  }else{
    localPublish.innerText = 'publisher'
    localRoomstreamvideo.style.display = 'block'
    localRoomstreamvideo.style.margin = '0 auto'
    webrtcPhone.publishOwnFeed()
  }
}
//记录是否接听过
function saveAccept(accepted){
  localStorage.setItem('FirstAccepted',accepted);
}

//获取接听信息
function getAccept(){
  return parseInt(localStorage.getItem('FirstAccepted'))
}

//获取是否全屏信息
function getScreenInfo(){
  return parseInt(localStorage.getItem('Screen'))
}


//保存设置信息
function saveSetInfo(isOn){
  localStorage.setItem('AcceptType',isOn);
}

//保存是否全屏信息
function saveScreenInfo(isOn){
  localStorage.setItem('Screen',isOn);
}


//获取保存设置信息
function getSetInfo(){
  return localStorage.getItem('AcceptType')
}

function getCamerInfo(){
  return localStorage.getItem('Camer')
}


function SetCamerInfo(numner){
  localStorage.setItem('Camer',numner);
}
//保存呼叫号
function saveCallNumber(){
  localStorage.setItem('CallNumber',$('#call-to').val().trim());
}

//保存登录信息
function saveLogins(account,passWard,mcuIP,gateway){
  localStorage.setItem('account',$('#Account').val().trim());  
  localStorage.setItem('passward',$('#passward').val().trim());  
  localStorage.setItem('mcuIP',$('#MCu').val().trim());
  localStorage.setItem('gateway',$('#GateWay-ip').val().trim()); 
}

function saveIPInfo() {
  let mcu = $('#MCu').val().trim()
  let gateway = $('#GateWay-ip').val().trim()
if(mcu.length > 0 && gateway.length > 0){
  localStorage.setItem('mcuIP',mcu);
  localStorage.setItem('gateway',gateway); 
  showPageWithIndex(0)
}else{
  if(mcu.length == 0) {
    alert('请输入服务器地址')
  }else if (gateway.length == 0) {
    alert('请输入网关地址')
  }
}

  
}


//获取保存的登录信息
function getLogins(numbers){
  let name = localStorage.getItem('account') 
  let MCu = localStorage.getItem('mcuIP') 
  let gateway = localStorage.getItem('gateway') 
  let pass = localStorage.getItem('passward') 
  return numbers(name,pass,MCu,gateway)
}

var time;
timeObj = document.getElementById("sid");
VideoObject = document.getElementById("state");
RoomTime = document.getElementById('Roomstate')
    
//时间处理
num = 0;
function changeTime(){
  num++;
  //3800
  //01:03:20   3600   180  20
  var hour = parseInt(num / 3600);
  var minute = parseInt((num - hour * 3600)/60); 
  var second = num % 60;
  if (hour==0) {
    t = ((minute<=9)?"0"+minute:minute)+":"+((second<=9)?"0"+second:second);
  }else{
    t = ((hour<=9)?"0"+hour:hour)+":"+((minute<=9)?"0"+minute:minute)+":"+((second<=9)?"0"+second:second); 
  }

  timeObj.innerText = t;
  VideoObject.innerText = t
  RoomTime.innerText = t
}      //开始计时
function StartTimes(){
  clearInterval(time);
  time = setInterval(changeTime,1000);
  b = 1;     
}      
 //暂停计时
 function CancleTime(){
  if (time) {
    clearInterval(time);  
  }
  
  num = 0;				
  t = "00:00";
  VideoObject.innerText = t
  timeObj.innerText = t;
  RoomTime.innerText = t
  
  b = 0;
}     
      
//拖动事件
//获取元素
var dv = document.getElementById('VideoLocal');
var x = 0;
var y = 0;
var l = 0;
var Atop = 0;
var isDown = false;
//鼠标按下事件
dv.onmousedown = function(e) {
    //获取x坐标和y坐标
    x = e.clientX;
    y = e.clientY;

    //获取左部和顶部的偏移量
    l = dv.offsetLeft;
    Atop = dv.offsetTop;
    //开关打开
    isDown = true;
    //设置样式  
    dv.style.cursor = 'move';
}
//鼠标移动
window.onmousemove = function(e) {
    if (isDown == false) {
        return;
    }

    //获取x和y
    var nx = e.clientX;
    var ny = e.clientY;
    //计算移动后的左偏移量和顶部的偏移量
    var nl = nx - (x - l);
    var nt = ny - (y - Atop);
    
    if(isDown){

      if(nl > 0  && nl < (document.body.clientWidth - 250)){
        dv.style.left = nl + 'px';
      }
      if (nt < -200 && nt >(-(document.body.clientHeight))){
        dv.style.top = nt + 'px';
      }
    }   
}
//鼠标抬起事件
window.onmouseup = function() {
    //开关关闭
    isDown = false;
    dv.style.cursor = 'default';
}   

