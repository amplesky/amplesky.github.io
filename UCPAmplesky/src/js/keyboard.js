$(
	
	
	function(){

	var MCu = document.getElementById('MCu')
	var GateWay = document.getElementById('GateWay-ip')

	var Account = document.getElementById('Account')
	var passward = document.getElementById('passward')

	var Callto = document.getElementById('call-to')
	Account.onclick=function (e) { 
        e.stopPropagation();//阻止事件冒泡即可 
        //e.cancelBubble=true;//非标准的IE方式:;  这里的cancelBubble是 IE事件对象的属性，设为true就可以了
	}
	
	passward.onclick=function (e) { 
        e.stopPropagation();
       
	}

	MCu.onclick=function (e) { 
        e.stopPropagation();//阻止事件冒泡即可 
        //e.cancelBubble=true;//非标准的IE方式:;  这里的cancelBubble是 IE事件对象的属性，设为true就可以了
	}
	
	GateWay.onclick=function (e) { 
        e.stopPropagation();
       
	}
	Callto.onclick=function (e) { 
        e.stopPropagation();
       
	}

	var  write 
	Callto.onfocus = isFocus
	
	MCu.onfocus = isFocus
	
	GateWay.onfocus = isFocus
	
	Account.onfocus = isFocus
	// Account.onblur = isFocus

	passward.onfocus = isFocus
	
	let KeyBoardView = document.getElementById('container')
	var isShow = false
	function isFocus(e){
		e.stopPropagation()
			isShow = true
			let showKeyboard = parseInt(getBoardInfo("Board"))
		if(document.activeElement.id=='MCu'){
			if(showKeyboard){
				write = document.getElementById('MCu')
				KeyBoardView.style.display = "block"
			}
			
		}else if(document.activeElement.id=='GateWay-ip'){
			if(showKeyboard){
			KeyBoardView.style.display = "block"
			write = document.getElementById('GateWay-ip')
			}
		}else if(document.activeElement.id=='Account'){
			if(showKeyboard){
			KeyBoardView.style.display = "block"
			write = document.getElementById('Account')
			}
		}else if(document.activeElement.id=='passward'){
			if(showKeyboard){
			KeyBoardView.style.display = "block"
			write = document.getElementById('passward')
			}
		}else if(document.activeElement.id=='call-to'){
			if(showKeyboard){
			KeyBoardView.style.display = "block"
			write = document.getElementById('call-to')
			}
		}
		else{
			// isShow = false
			// KeyBoardView.style.display = "none"
		}

		return false
	}


		shift = false,
		capslock = false;
	// Download by http://www.codefans.net
	$('#keyboard li').click(function(){
		var $this = $(this),
			character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
		
		if($this.hasClass('Down') || $this.hasClass('return')){
			let keyboard = document.getElementById("container")
			keyboard.style.display = "none"
		return;
		}

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
			var html = write.value;			
			write.value = (html.substr(0, html.length - 1));
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
		write.value = (write.value + character);
		return false; 
	});

	




let netstate = true
let isotherPage = false
	let accountobject = document.getElementById('Account')
	let serverobject = document.getElementById('MCu')
	let gateobjct = document.getElementById('GateWay-ip')
	let passObject = document.getElementById('passward')
	let icename = document.getElementById('ICeName')
	let icepass = document.getElementById('ICePass')
	if(localStorage.getItem("ICeName") != null){
		icename.value =  localStorage.getItem("ICeName")
	}
	
	if(localStorage.getItem("ICePass") != null){
		icepass.value = localStorage.getItem("ICePass")
	}
	
	let iceserver = document.getElementById('iceServer')

	if(localStorage.getItem('iceServer') != null){
		iceserver.value =  localStorage.getItem('iceServer')
	}
	
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
let LocalName= document.getElementById('LocalName')
let RoomName = document.getElementById('RoomName');
var commingCall
let SwitchSpeaker = false
var SwitchVideo = false
var videoAudio = false
let AudioSpeaker = false
var isaudio = false
let isclose = false //记录是否关闭call页面,解决长时通话自动断线重连导致通话在返回呼叫页面
var VideoCallName = document.getElementById('VideoCallName')
var ListenTime
var areadyReLogin = false;
let AlertBottomView = document.getElementById('AlertBottomView')

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
  isVideoCall = jsp.sdp.indexOf("m=video ") > -1
  if (isVideoCall) {
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
  acceptedAction()
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
  AlertBottomView.style.display = 'block'
  $('.alertVC').show()
  alertText.innerText = "与服务器断开连接"
  setTimeout(() => {
	
	$('.alertVC').hide() 
	AlertBottomView.style.display = 'none'
	
  }, 1000);

  if(!areadyReLogin){
	webrtcPhone.logout()
	webrtcPhone.outLine(false)
	ReloadAction()
  }

 
})

var Shownum = 0
$(document).on('callaccepted', function (ev) {
 
  let jsp =  webrtcPhone.getCurrentjsp
  if(isVideoCall){
	saveAccept(1);
  }

  Shownum = 0;
  acceptedAction()
  
  StartTimes()
  setTimeout(() => {
	getStats(webrtcPhone.getVideoCall())    
  }, 1000);
  
});

function acceptedAction(){
	localvideo.style.display = "block"
	AnimationLoading.style.display = 'block'
	$('.CommingCall').hide();
	$('#callName').html(commName);
	$('#hangup-btn').removeAttr('disabled');
	$('#output-lbl').text('...in conversation with ' + webrtcPhone.getCounterpartNum());
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
}



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
	AlertBottomView.style.display = 'block'
	$('.alertVC').show()
	
	alertText.innerText = messgae
	setTimeout(() => {
	  $('.alertVC').hide() 
	  AlertBottomView.style.display = 'none'
	}, 1000);
  }else if(code == undefined && messgae == "Remote WebRTC hangup"){
	  	AlertBottomView.style.display = 'block'
		$('.alertVC').show()
	
	alertText.innerText = messgae
	setTimeout(() => {
	  $('.alertVC').hide() 
	  AlertBottomView.style.display = 'none'
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
	//   console.log(res)
	  getCallMessage(res)
  }


  clearInterval(CallMessageTimer)
  CallMessageTimer = setInterval(() => {
	getStats(peer,function(message){
	});
  }, 1000);


 
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
	  password: $('#passward').val(),
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
		AlertBottomView.style.display = 'block'
		  $('.alertVC').show()
		  alertText.innerText = errorBack
		  setTimeout(() => {
			$('.alertVC').hide() 
			AlertBottomView.style.display = 'none'
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
	  AlertBottomView.style.display = 'none'
	  $('.alertVC').hide()
	  
	},3000);
}
let myVideo = document.getElementById('remote-stream-video')


//监听网络是否连接
window.addEventListener('online',function () {
  webrtcPhone.logout()
  webrtcPhone.outLine(false)
  ReloadAction()
  AlertBottomView.style.display = 'block'
	$('.alertVC').show()

alertText.innerText = "网络已连接"
setTimeout(() => {
  $('.alertVC').hide() 
  AlertBottomView.style.display = 'none'
}, 1000);
})

// 进入页面执行
// 记录当前时间并转成时间戳
const now = new Date().getTime();
// 从缓存中获取用户上次退出的时间戳
const leaveTime = parseInt(localStorage.getItem('leaveTime'), 10);
// 判断是否为刷新，两次间隔在1s内判定为刷新操作
const refresh = (now - leaveTime) <= 1000;
// 测试alert
if(refresh){
	webrtcPhone.hangup()
	webrtcPhone.logout()
}else{
	webrtcPhone.hangup()
	webrtcPhone.refreshLogOut()
}

// 退出当前页面执行
window.onbeforeunload = function(e){
  // 将退出时间存于localstorage中
  localStorage.setItem('leaveTime', new Date().getTime());
  webrtcPhone.hangup()
	webrtcPhone.logout()
}

// window.onbeforeunload = (e) => {
// 	if ((event.clientX > document.body.clientWidth && event.clientY < 0) || event.altKey) {
// 		webrtcPhone.hangup()
// 		webrtcPhone.logout()
   
// 	} else {
// 	   //刷新网页
// 	   webrtcPhone.hangup()
// 	   webrtcPhone.logout()
//    }
//    return nil   
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
AlertBottomView.style.display = 'block'
$('.alertVC').show()
setTimeout(f, 2000);
alertText.innerText = text
function f(){
  $('.alertVC').hide()
  AlertBottomView.style.display = 'none'
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
AlertBottomView.style.display = 'block'
$('.alertVC').show()
alertText.innerText = "网络连接断开"
setTimeout(() => {
  $('.alertVC').hide() 
  AlertBottomView.style.display = 'none'
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
AlertBottomView.style.display = 'block'
  $('.alertVC').show()  
  setTimeout(f, 1000);
  alertText.innerText = text
  function f(){
	$('.alertVC').hide()
	AlertBottomView.style.display = 'none'
	
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

//会议房间
$('#Roomaudio-btn').click(function () {
	clickAcion()
	webrtcPhone.mut()
	videoAudio = !videoAudio
	if (videoAudio) {
	  $('#Roomaudio-btn').attr('src', './sounds/CloseAudio.png');
	  AlertAction("麦克风关闭")
	}else{
	  $('#Roomaudio-btn').attr('src', './sounds/Audio.png');
	  AlertAction("麦克风打开")
	}
  });


$('#RoomSpeaker-btn').click(function () {
	SwitchSpeaker = !SwitchSpeaker
	clickAcion()
	let videocontrol = document.getElementById("Local-Roomstream-video0");
	if (SwitchSpeaker) {
	  $('#RoomSpeaker-btn').attr('src', './sounds/NoSpeaker.png');
	  AlertAction("扬声器关闭")
	  $(document).trigger('RoomMutAudio',[1]);
	}else{
		$(document).trigger('RoomMutAudio',[0]);
	  $('#RoomSpeaker-btn').attr('src', './sounds/Speaker.png');
	  AlertAction("扬声器打开")
	}
  })

  $('#Roomvideo-btn').click(function () {
	clickAcion()
	webrtcPhone.RoommutVideo()

	SwitchVideo = !SwitchVideo
	if (SwitchVideo) {
	  $('#Roomvideo-btn').attr('src', './sounds/CloseVideo.png');
	  AlertAction("视频关闭")
	  
	}else{
	  
	  $('#Roomvideo-btn').attr('src', './sounds/Video.png');
	  AlertAction("视频打开")
	}
  });
  
  $('#Roomhangup-btn').click(function () {
	webrtcPhone.exitRoom();
	CancleTime()
	showPageWithIndex(1)
	Shownum = 1
	isotherPage = false
	clickAcion()
	AlertAction("退出会议房间")
	SwitchSpeaker = false;
  	SwitchVideo = false;
  	videoAudio = false;
	  AudioSpeaker = false
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
 	LocalName.innerText = UserName;
 	SwitchSpeaker = false;
	SwitchVideo = false;
  	videoAudio = false;
	  AudioSpeaker = false
	  $('#Roomaudio-btn').attr('src', './sounds/Audio.png');
	  $('#Roomvideo-btn').attr('src', './sounds/Video.png');
	  $('#RoomSpeaker-btn').attr('src', './sounds/Speaker.png');
  	showPageWithIndex(6)
})

$(document).on('CreatSuccess', function (ev) {
	RoomName.innerText = '房间: ' + String(RoomNnumber)
  	webrtcPhone.joinRoom(RoomNnumber,UserName)
  	StartTimes()
})

$(document).on('CreatFail', function (ev) {
	RoomName.innerText = '房间: ' + String(RoomNnumber)
  	alert("创建房间失败,请重试")
})

$(document).on('RoomExists', function (ev) {
	RoomName.innerText = '房间: ' + String(RoomNnumber)
  	webrtcPhone.joinRoom(RoomNnumber,UserName)
  	StartTimes()
})

$(document).on('RoomExistsFail', function (ev) {
	RoomName.innerText = '房间: ' + String(RoomNnumber)
  	webrtcPhone.creatRoom(RoomNnumber)
})


$(document).on('VideoRoomSuccess', function (ev) {
	RoomName.innerText = '房间: ' + String(RoomNnumber)
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

let AudioTextReceive = ""
let AudioTextSend = ""
let VideoTextReceive = ""
let VideoTextSend = ""
let isVideoSend = false
let messageTextVideo = document.getElementById('messageTextVideo')
let messageTextAudio = document.getElementById('messageTextAudio')
//获取视频流信息
function getCallMessage(message){
if(message["googContentType"] == "realtime"){
	
	if(parseInt(message["googRtt"]) > 0){
		//发送
		VideoTextSend = "\n"
		Object.keys(message).map((key,index)=>{
			if(key != "googTimingFrameInfo"){
				let value = message[key]	
				VideoTextSend = VideoTextSend + key + ": " + value + "\n"
			}
		})
	}else{
		VideoTextReceive = "\n"
	Object.keys(message).map((key,index)=>{
		if(key != "googTimingFrameInfo"){
			let value = message[key]	
			VideoTextReceive = VideoTextReceive + key + ": " + value + "\n"
		}
	})
	}
  }

  if(parseInt(message["audioInputLevel"]) > 0){
	if(parseInt(message["googRtt"]) > 0){
		AudioTextSend = "\n"
		Object.keys(message).map((key,index)=>{
			let value = message[key]	
			AudioTextSend = AudioTextSend + key + ": " + value + "\n"
		})
	}else{
		AudioTextReceive = "\n"
		Object.keys(message).map((key,index)=>{
			let value = message[key]	
			AudioTextReceive = AudioTextReceive + key + ": " + value + "\n"
		})
	}
	
  }

  if(this.isVideoSend){
	messageTextVideo.innerText = VideoTextSend
	messageTextAudio.innerText = AudioTextSend
  }else{
	messageTextVideo.innerText = VideoTextReceive
	messageTextAudio.innerText = AudioTextReceive
  }
}  
});

let MessageVideo = document.getElementById('MessageVideo')
let MessageAudio = document.getElementById('MessageAudio')
let MessageVideoReceive = document.getElementById('MessageVideoReceive')
let MessageVideoSend = document.getElementById('MessageVideoSend')
let ReceiveImage = document.getElementById('ReceiveImage')
let SendImage = document.getElementById('SendImage')
MessageVideo.style.backgroundColor = '#CFCFCF'
MessageVideoReceive.style.color = "black"

function ClickMessageInfo(num){
	if(num == 0){
		messageTextVideo.style.display = "block"	
		messageTextAudio.style.display = "none"
		MessageVideo.style.backgroundColor = '#CFCFCF'
		MessageAudio.style.backgroundColor = 'transparent'
	}else{
		messageTextVideo.style.display = "none"	
		messageTextAudio.style.display = "block"
		MessageAudio.style.backgroundColor = '#CFCFCF'
		MessageVideo.style.backgroundColor = 'transparent'
	}
}
ReceiveImage.src = "./sounds/Select.png"
function ClickVideoMessage(num){
	if(num == 0){
		this.isVideoSend = false
		ReceiveImage.src = "./sounds/Select.png"
		SendImage.src = "./sounds/NoSeleted.png"
	}else{
		SendImage.src = "./sounds/Select.png"
		ReceiveImage.src = "./sounds/NoSeleted.png"
		this.isVideoSend = true
	}
}

function DisPlayVideo(number){
	webrtcPhone.ClickVideoDisplay(number);
}

//有点击事件后暂停定时器
var Clicknum = 0
var Clicktime;
function clickAcion() {
if(isScreen){
  Clicknum = 0
  clearInterval(Clicktime);
  Clicktime = setInterval(VideoClickTime,1000);
} 
}

function VideoClickTime() {
  Clicknum++
  if (Clicknum == 5){
	// $("#VideoBottom").animate({bottom:'-210px'});
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
function MessageCancle(){
	show= false
	$('.MessageVC').hide();
}
let isShowRoom = false
let RoomBig = document.getElementById('BigVideoID')
let RoomScreenImg = document.getElementById('RoomScreenImg')
let RoomBottomItem = document.getElementById('RoomBottomItem')


let isDbClick = false
let isChangeBig = false
let	AlreadyScreen = false
let isScreen = false
let HidTimer
$(document).on('ShowBigVideo',function (ev) {
	if(isDbClick){
		RoomBig.style.bottom = "150px"
		RoomBig.style.top = '80px'
		isDbClick = false
		clearTimeout(HidTimer)
		$("#RoomBottomItem").animate({bottom:'0px'});
		if(isChangeBig){
			RoomBig.style.display = "none"
			isChangeBig = false
		}
	}else{
			RoomBig.style.bottom = "0px"
			RoomBig.style.top = '0px'
			isDbClick = true
			isChangeBig = true;
			clearTimeout(HidTimer)
			HidTimer =	setTimeout(RoomVideoTimer, 5000);		
	}
})
function RoomVideoTimer(){
	$("#RoomBottomItem").animate({bottom:'-110px'});	
}
 //点击大屏
function ClickBigVideo(){
	if(isDbClick){
		clearTimeout(HidTimer)
		$("#RoomBottomItem").animate({bottom:'0px'});
		HidTimer =	setTimeout(RoomVideoTimer, 5000);
	}
}


//房间全屏
RoomScreenImg.onclick = function(e){
	e.stopPropagation()
	ScreenClick()
}

//全屏功能按钮的显示隐藏
let remoteObject = document.getElementById('remoteVideo')
let VideoBottom = document.getElementById('VideoBottom')
let VideoTopDiv = document.getElementById('VideoTopDiv')
var docElm = document.documentElement;
let VideoCallTimeOut
// var localObjc= document.getElementById('VideoLocal');
function ScreenClick() {
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
  if(!isShowRoom){
	$('#ScreenImg').attr('src', './sounds/NoScreen.png');
  }else{
	$('#RoomScreenImg').attr('src', './sounds/NoScreen.png');
  }

}else{
  screenAction(false)
  if(!isShowRoom){
	$('#ScreenImg').attr('src', './sounds/Screen.png');
  }else{
	$('#RoomScreenImg').attr('src', './sounds/Screen.png'); 
  }
  clearTimeout(VideoCallTimeOut)
  $("#VideoBottomAuto").animate({bottom:'0px'});
  $("#VideoHangUpAuto").animate({bottom:'0px'});
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


//视频通话双击视频框全屏与非全屏
let VideoIsSCreen = false
function DoubleClickScreen(){
	VideoIsSCreen = !VideoIsSCreen
	if(VideoIsSCreen){
		remoteObject.style.height = '100%'
		remoteObject.style.marginTop = '0'
		clearTimeout(VideoCallTimeOut)
  		VideoCallTimeOut = setTimeout(VideoCallTimeAction, 5000);
	}else{
		remoteObject.style.height = '68%'
		remoteObject.style.marginTop = '100px'
		$("#VideoBottomAuto").animate({bottom:'0px'});
  		$("#VideoHangUpAuto").animate({bottom:'0px'});
  		$("#VideoTopDiv").animate({top:'0px'});
  		$("#screenButton").animate({top:'30px'});
	}
}

//点击显示功能按钮
function ClickVideoScreeen(e) {
	// e.stopPropagation()
if(VideoIsSCreen){
  $("#VideoBottomAuto").animate({bottom:'0px'});
  $("#VideoHangUpAuto").animate({bottom:'0px'});
  $("#VideoTopDiv").animate({top:'0px'});
  $("#screenButton").animate({top:'30px'});
  clearTimeout(VideoCallTimeOut)
  VideoCallTimeOut = setTimeout(VideoCallTimeAction, 5000);
  
}

}

function VideoCallTimeAction(){
	if(VideoIsSCreen){
	$("#VideoBottomAuto").animate({bottom:'-210px'});
	$("#VideoHangUpAuto").animate({bottom:'-210px'});
	$("#VideoTopDiv").animate({top:'-210px'});
	$("#screenButton").animate({top:'-210px'});
	}
  }

function screenAction(params) {
var docElm = document.documentElement;

if(params){
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

window.addEventListener("resize", function () {
//根据当前的状态显示图标
if(!document.fullscreenElement &&
	!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement){
   //退出全屏状态。。。
  //  screenAction()
  isScreen = false
  VideoCallTimeOut = setTimeout(VideoCallTimeAction, 5000);
  $("#VideoBottomAuto").animate({bottom:'0px'});
  $("#VideoHangUpAuto").animate({bottom:'0px'});
  $("#VideoTopDiv").animate({top:'0px'});
  $("#screenButton").animate({top:'30px'});

if (document.msExitFullscreen) { 
  document.msExitFullscreen(); 
} else if (document.mozCancelFullScreen) { 
  document.mozCancelFullScreen(); 
} else if (document.webkitCancelFullScreen) { 
  document.webkitCancelFullScreen(); 
}
if(!isShowRoom){
	$('#ScreenImg').attr('src', './sounds/Screen.png');
}else{
	$('#RoomScreenImg').attr('src', './sounds/Screen.png');
}
  clearInterval(Clicktime);
}else{
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

let SelectMore = false
function MoreSetting(){
	let More = document.getElementById('Protol')
	SelectMore = !SelectMore;
	if(SelectMore){
		More.style.display = 'none'
	}else{
		More.style.display = 'block'
	}	
}

//设置传输模式
function SelectTurn(number){
let turn = document.getElementById('turn')
// let two = document.getElementById('Camer1')
let stun = document.getElementById('stun')
let protol = document.getElementById('Protol')
let iceServer = document.getElementById('iceServer')
if(!canEdite){
	return
}
switch(number){
	case 0:
		turn.src = "./sounds/Select.png"
	  // two.src = "./sounds/NoSeleted.png"
	  stun.src = "./sounds/NoSeleted.png"
	  protol.style.display = 'inline-block'
	  iceServer.value = "turn.amplesky.com:3478"
	  setTURN(0)
	break
	case 1:
	  turn.src = "./sounds/NoSeleted.png"
	  // two.src = "./sounds/Select.png"
	  stun.src = "./sounds/NoSeleted.png"
	 
	break
	case 2:
	  turn.src = "./sounds/NoSeleted.png"
	  // two.src = "./sounds/NoSeleted.png"
	  stun.src = "./sounds/Select.png"
	  protol.style.display = 'none'
	  iceServer.value = "stun.amplesky.com:3478"
	  setTURN(2)
	 
	break
	default:
	break
  }
}

function SelectProtal(number){
	
	if(!canEdite){
		return
	}

	let udp = document.getElementById('UDP')
	// let two = document.getElementById('Camer1')
	let tcp = document.getElementById('TCP')
	switch(number){
		case 0:
			udp.src = "./sounds/Select.png"
		  // two.src = "./sounds/NoSeleted.png"
		  tcp.src = "./sounds/NoSeleted.png"
			setProtol("0")
		break
		case 1:
		  tcp.src = "./sounds/NoSeleted.png"
		  // two.src = "./sounds/Select.png"
		  udp.src = "./sounds/NoSeleted.png"
		 
		break
		case 2:
		  udp.src = "./sounds/NoSeleted.png"
		  // two.src = "./sounds/NoSeleted.png"
		  tcp.src = "./sounds/Select.png"
		  setProtol("2")
		 
		break
		default:
		break
	  }
}


//设置本地摄像头旋转
function SelectCamer(number){
let one = document.getElementById('Camer0')
// let two = document.getElementById('Camer1')
let three = document.getElementById('Camer2')
let size = 1
switch(number){
  case 0:
	one.src = "./sounds/Select.png"
	// two.src = "./sounds/NoSeleted.png"
	three.src = "./sounds/NoSeleted.png"
	document.getElementsByTagName('body')[0].style.zoom=1
	SetCamerInfo("0")
  break
  case 1:
	one.src = "./sounds/NoSeleted.png"
	// two.src = "./sounds/Select.png"
	three.src = "./sounds/NoSeleted.png"
	
	document.getElementsByTagName('body')[0].style.zoom=1.3
	// SetCamerInfo(1)
  break
  case 2:
	one.src = "./sounds/NoSeleted.png"
	// two.src = "./sounds/NoSeleted.png"
	three.src = "./sounds/Select.png"
	size = size + 0.5;  
	document.body.style.zoom = size;
	document.body.style.cssText += '; -moz-transform: scale(' + size + ');';   
	document.getElementsByTagName('body')[0].style.zoom=1.5
	SetCamerInfo("2")
  break
  default:
  break
}
}

let HomesetType = true
let canEdite = true
// let backIDDiV = document.getElementById('backID')


function CallacceptType() {
HomesetType = false
let info = getSetInfo()
let Screeninfo = getScreenInfo()
let KeyBoardinfo = getBoardInfo()

 let Switch = document.getElementById('onoffswitch')
 let ScreenSwitch = document.getElementById('Screenswitch')
 let KeyBoardswitch = document.getElementById('KeyBoardswitch')

 if(KeyBoardinfo == 1){
	KeyBoardswitch.checked = true
  }else{
	KeyBoardswitch.checked = false 
  }

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
  $('#ICeName').attr('disabled','disabled');
  $('#ICePass').attr('disabled','disabled');
  $('#iceServer').attr('disabled','disabled');
  canEdite = false
//   backIDDiV.style.display = "inline-block"
  let Setsave = document.getElementById('SetSave') 
  let SetDiv = document.getElementById('SetDiv') 
  SetDiv.innerText = "设置"
  Setsave.innerText = "注销"

  //设置本地摄像头旋转
  let camerNum = getCamerInfo()
  if(camerNum == null){
	camerNum = "0"
  }
  SelectCamer(parseInt(camerNum))    
}

function Connect(){
}



let iceinfo = getTURN()
if(iceinfo == null){
	iceinfo = "2"
}
SelectTurn(parseInt(iceinfo))  

let Protol = getProtol()
if(Protol == null){
	Protol = "0"
}
SelectProtal(parseInt(Protol))  


let camerNum = getCamerInfo()
if(camerNum == null){
camerNum = "0"
}
SelectCamer(parseInt(camerNum))        

//设置页保存事件
function setSaveClick() {
if(HomesetType){
	AlertBottomView.style.display = 'block'
  $('.alertVC').show()
  setTimeout(f, 1000);
  alertText.innerText = "保存成功"
  function f(){
	$('.alertVC').hide()
	AlertBottomView.style.display = 'none'
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
 let KeyBoardInfo = getBoardInfo()
 let Switch = document.getElementById('onoffswitch')
 let ScreenSwitch = document.getElementById('Screenswitch')
 let KeyBoardSwitch = document.getElementById('KeyBoardswitch')
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

 if (KeyBoardInfo == 1) {
	KeyBoardSwitch.checked = true
   }else{
	KeyBoardSwitch.checked = false 
   }

 showPageWithIndex(5);
  $('#MCu').removeAttr('disabled');
  $('#GateWay-ip').removeAttr('disabled');
  $('#ICeName').removeAttr('disabled');
  $('#ICePass').removeAttr('disabled');
  $('#iceServer').removeAttr('disabled');
  canEdite = true
//   backIDDiV.style.display = "none"
  let Setsave = document.getElementById('SetSave') 
  let SetDiv = document.getElementById('SetDiv') 
  SetDiv.innerText = "设   置"
  Setsave.innerText = "保存"

  //设置本地摄像头旋转
  let camerNumber = getCamerInfo()
  if(camerNumber == null){
	camerNumber = "0"
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


$("#KeyBoardswitch").on('click', function(){
	if ($("#KeyBoardswitch").is(':checked')) {
	  console.log("在ON的状态下");
	  setBoardInfo(1)
	
	} else {
	  console.log("在OFF的状态下");
	  setBoardInfo(0)
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
	VideoIsSCreen = false
	isScreen = false;
	let setinfo = getScreenInfo()
	if(setinfo == 1){
		$('#ScreenImg').attr('src', './sounds/NoScreen.png');
		
	  }else{
		$('#ScreenImg').attr('src', './sounds/Screen.png');
	  }
	
$('.MessageVC').hide();
isShowRoom =false
dissKeyBoard()
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
	  $('.SetVC').hide();
	break;
  case 3:
	  isotherPage = true
	  $('.index').hide();
	  $('.CallVC').hide();
	  $('.AudioCallVC').hide();
	  $('.VideoCallVC').show();
	  $('.VideoRoom').hide();
	  $('.SetVC').hide();
	 break;     
  case 4:
	  $('.index').hide();
	  $('.CallVC').hide();
	  $('.AudioCallVC').hide();
	  $('.VideoCallVC').hide();   
	  $('.VideoRoom').hide();
	  $('.SetVC').hide();
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
	  isShowRoom= true
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


//获取是软键盘
function getBoardInfo(){
	return parseInt(localStorage.getItem('board'))
}


//获取是软键盘
function setBoardInfo(ison){
	localStorage.setItem('board',ison);
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

//获取ice模式信息
function getTURN(){
	return localStorage.getItem('TURN')	
}


//保存设置ice模式
function setTURN(number){
	localStorage.setItem('TURN',number);	
}
//保存设置ice模式
function setProtol(number){
	localStorage.setItem('Protol',number);	
}


//获取ice模式信息
function getProtol(){
	return localStorage.getItem('Protol')	
}



//保存放大还是标准模式
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
let iceServer = $('#iceServer').val().trim()
if(mcu.length > 0 && gateway.length > 0 && iceServer.length > 0){
localStorage.setItem('mcuIP',mcu);
localStorage.setItem('gateway',gateway); 
localStorage.setItem('iceServer',iceServer)
}else{
if(mcu.length == 0) {
  alert('请输入服务器地址')
  return
}else if (gateway.length == 0) {
  alert('请输入网关地址')
  return
}

}
let iceAccount = $('#ICeName').val().trim()
let icePass = $('#ICePass').val().trim()
if(parseInt(getTURN()) == 0 && iceAccount.length > 0 &&icePass.length > 0){
	localStorage.setItem('ICeName',iceAccount);
	localStorage.setItem('ICePass',icePass); 
	
}else{
	if(iceAccount.length == 0) {
		alert('请输入用户名')
		return 
	  }else if (icePass.length == 0) {
		alert('请输入密码')
		return 
	  }	
	 
}

showPageWithIndex(0)

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

	if(nl > 0  && nl < (document.body.clientWidth - 300)){
	  dv.style.left = nl + 'px';
	}
	if (nt < - 168.75 && nt >(-(document.body.clientHeight))){
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


function dissKeyBoard(){
let keyboard = document.getElementById("container")
		keyboard.style.display = "none"	

	
}
