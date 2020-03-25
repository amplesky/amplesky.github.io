import React, {Component} from 'react';
import {
    Alert,
    AppState,
    DeviceEventEmitter,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import Janus from '../janus.mobile.js';
import InCallManager from 'react-native-incall-manager';
import {GiftedChat} from 'react-native-gifted-chat';
import Global from "../Global";
import Orientation from "react-native-orientation";
import Toast from 'react-native-easy-toast'
import {getRemainingime} from "../ScreenUtil";
import IdleTimerManager from "react-native-idle-timer";
var IsIOS = Platform.OS === 'ios' ? 1 : 0
var {width, height} = Dimensions.get('window')
var isIphoneX = ((IsIOS) && (height >= 812)) ? 1 : 0
var bottomHeight2 = isIphoneX ? 68 : 30
var bottomHeight = isIphoneX ? 68 : 20
var stateBar = isIphoneX ? 44 : 20
var ViewPositionTop = stateBar + 10
let janus;
let myusername = '';
let myid = null;
let mystream = null;
let started = false;
let sfutest = null;
let bitrateTimer = [];
let sendData = null;
var opaqueId = "videoroomtest-" + Math.random().toString().slice(-10);
var isFront = true;

let isBig = false;
let bigView = -1;
Janus.init({
    debug: false, callback: function () {
        if (started)
            return;
        started = true;
    }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // selfViewSrc: null,
            // selfViewSrcKey: null,
            publish: false,
            info: 'Initializing',
            status: 'init',
            remoteList: {},
            remoteListPluginHandle: {},
            remoteStreams: {},
            // mainViewSrc: null,
            text: '',
            roomList: [],
            chatList: [],
            audioMute: false,
            videoMute: false,
            speaker: false,
            remoteMute: false,
            currentId: '',
            messages: [],
            curOrt: 'PORTRAIT',
            videoImage: require('../icon/ic_videocam_white_48dp.png'),
            audioImage: require('../icon/ic_mic_white_48dp.png'),
            soundImage: require('../icon/ic_volume_off_white_48dp.png'),
            isVideoOpen: true,
            zoomWidth: width,
            zoomHeight: height,
            selectItem: [],
            translateX: 0,
            translateY: 0,
            column: 2,
            roomId: 0,
            TimeTxt: '',
            startTimeStamp: null,
            unmount: false,
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this)
    }

    static navigationOptions = ({navigation}) => ({
        header: null
    })
    _orientationDidChange = (ori) => {
        this.setState({
            curOrt: 'PORTRAIT'
        });
    }

    componentWillMount() {
        IdleTimerManager.setIdleTimerDisabled(true);
        AppState.addEventListener('change', this.handleAppStateChange);
        this.state.curOrt = 'PORTRAIT';
    }

    componentWillUnmount() {
        IdleTimerManager.setIdleTimerDisabled(false);
        Orientation.unlockAllOrientations()
        if (janus) {
            janus.destroy()
        }
        Global.currentPage = 'CallVC'
        AppState.removeEventListener('change', this.handleAppStateChange);
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    handleAppStateChange(appState) {
        if (appState == 'active') {
            Orientation.getOrientation((err, orientation) => {
                this.setState({
                    curOrt: 'PORTRAIT'
                })
            });
        }
    }

    componentDidMount() {
        Orientation.lockToPortrait()
        Global.currentPage = 'room'
        Orientation.addOrientationListener(this._orientationDidChange);
        let {room, displayname, gateway, ice} = this.props.navigation.state.params;
        myusername = displayname;
        this.state.roomId = parseInt(room);
        // InCallManager.start({media: 'audio'})
        console.info("gatawa:" + gateway)
        janus = new Janus({
            server: gateway,
            iceServers: [{urls: ice}],
            success: () => {
                janus.attach({
                    plugin: "janus.plugin.videoroom",
                    opaqueId: opaqueId,
                    success: (pluginHandle) => {
                        sfutest = pluginHandle;
                        sendData = sfutest.data;
                        //     "request" : "create",
                        //     "room" : <unique numeric ID, optional, chosen by plugin if missing>,
                        // "permanent" : <true|false, whether the room should be saved in the config file, default=false>,
                        // "description" : "<pretty name of the room, optional>",
                        // "secret" : "<password required to edit/destroy the room, optional>",
                        // "pin" : "<password required to join the room, optional>",
                        // "is_private" : <true|false, whether the room should appear in a list request>,
                        // "allowed" : [ array of string tokens users can use to join this room, optional],
                        // ...
                        // }
                        //

                        // room-<unique room ID>: {
                        //     description = This is my awesome room
                        //     is_private = true|false (private rooms don't appear when you do a 'list' request)
                        //     secret = <optional password needed for manipulating (e.g. destroying) the room>
                        //     pin = <optional password needed for joining the room>
                        //     require_pvtid = true|false (whether subscriptions are required to provide a valid
                        //     a valid private_id to associate with a publisher, default=false)
                        //     publishers = <max number of concurrent senders> (e.g., 6 for a video
                        //     conference or 1 for a webinar, default=3)
                        //     bitrate = <max video bitrate for senders> (e.g., 128000)
                        //     fir_freq = <send a FIR to publishers every fir_freq seconds> (0=disable)
                        //     audiocodec = opus|g722|pcmu|pcma|isac32|isac16 (audio codec to force on publishers, default=opus
                        //     can be a comma separated list in order of preference, e.g., opus,pcmu)
                        //     videocodec = vp8|vp9|h264 (video codec to force on publishers, default=vp8
                        //     can be a comma separated list in order of preference, e.g., vp9,vp8,h264)
                        //     opus_fec = true|false (whether inband FEC must be negotiated; only works for Opus, default=false)
                        //     video_svc = true|false (whether SVC support must be enabled; only works for VP9, default=false)
                        //     audiolevel_ext = true|false (whether the ssrc-audio-level RTP extension must be
                        //     negotiated/used or not for new publishers, default=true)
                        //     audiolevel_event = true|false (whether to emit event to other users or not)
                        //     audio_active_packets = 100 (number of packets with audio level, default=100, 2 seconds)
                        //     audio_level_average = 25 (average value of audio level, 127=muted, 0='too loud', default=25)
                        //     videoorient_ext = true|false (whether the video-orientation RTP extension must be
                        //     negotiated/used or not for new publishers, default=true)
                        //     playoutdelay_ext = true|false (whether the playout-delay RTP extension must be
                        //     negotiated/used or not for new publishers, default=true)
                        //     transport_wide_cc_ext = true|false (whether the transport wide CC RTP extension must be
                        //     negotiated/used or not for new publishers, default=true)
                        //     record = true|false (whether this room should be recorded, default=false)
                        //     rec_dir = <folder where recordings should be stored, when enabled>
                        //     notify_joining = true|false (optional, whether to notify all participants when a new
                        //     participant joins the room. The Videoroom plugin by design only notifies
                        //     new feeds (publishers), and enabling this may result extra notification
                        //     traffic. This flag is particularly useful when enabled with \c require_pvtid
                        //     for admin to manage listening only participants. default=false)
                        //     }

                        let createroom = {
                            "request": "create",
                            "room": this.state.roomId,
                            "permanent": false,
                            "is_private": false,
                            "publishers": 9,
                            "bitrate": 1048000,
                            "opus_fec": true,
                        }
                        sfutest.send({"message": createroom});
                    },
                    error: (error) => {
                        console.info("error" + error)
                    },
                    consentDialog: (on) => {
                    },
                    mediaState: (medium, on) => {
                    },
                    webrtcState: (on) => {
                    },
                    onmessage: (msg, jsep) => {
                        if (this.state.unmount) {
                            return;
                        }
                        var event = msg["videoroom"];
                        if (event != undefined && event != null) {
                            if (event === "created") {
                                let register = {
                                    "request": "join",
                                    "room": this.state.roomId,
                                    "ptype": "publisher",
                                    "display": myusername.toString()
                                };
                                sfutest.send({"message": register});
                            } else if (event === "joined") {
                                this.state.startTimeStamp = new Date().getTime();
                                console.info("\n\n打开扬声器")
                                InCallManager.setSpeakerphoneOn(false)
                                myid = msg["id"];
                                this.publishOwnFeed(true);
                                if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                                    var list = msg["publishers"];
                                    this.setState({
                                        roomList: list
                                    })
                                    for (var f in list) {
                                        var id = list[f]["id"];
                                        var display = list[f]["display"];
                                        this.newRemoteFeed(id, display)
                                    }
                                }
                            } else if (event === "destroyed") {
                            } else if (event === "event") {
                                if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                                    var list = msg["publishers"];
                                    for (var f in list) {
                                        let id = list[f]["id"]
                                        let display = list[f]["display"]
                                        this.newRemoteFeed(id, display)
                                    }
                                } else if (msg["leaving"] !== undefined && msg["leaving"] !== null) {
                                    var leaving = msg["leaving"];
                                    var remoteFeed = null;
                                    let numLeaving = parseInt(msg["leaving"])
                                    if (this.state.remoteList.hasOwnProperty(numLeaving)) {
                                        delete this.state.remoteList[numLeaving]

                                        let length1 = Object.keys(this.state.remoteList).length;
                                        if (length1 <= 4) {
                                            this.setState({
                                                column: 2
                                            })
                                        } else {
                                            this.setState({
                                                column: 3
                                            })
                                        }

                                        console.info(length1 + "有人lieaving了 " + this.state.column)
                                        this.setState({remoteList: this.state.remoteList})
                                        this.state.remoteListPluginHandle[numLeaving].detach();
                                        delete this.state.remoteListPluginHandle[numLeaving]
                                    }
                                } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                                    var unpublished = msg["unpublished"];
                                    if (unpublished === 'ok') {
                                        sfutest.hangup();
                                        return;
                                    }
                                    let numLeaving = parseInt(msg["unpublished"])
                                    console.info("有人unpublished了 1111 " + numLeaving)
                                    if (this.state.remoteList.hasOwnProperty(numLeaving)) {
                                        delete this.state.remoteList[numLeaving]
                                        let length1 = Object.keys(this.state.remoteList).length;
                                        if (length1 <= 4) {
                                            this.setState({
                                                column: 2
                                            })
                                        } else {
                                            this.setState({
                                                column: 3
                                            })
                                        }
                                        console.info(length1 + "有人unpublished了2222 " + this.state.column)
                                        this.setState({remoteList: this.state.remoteList})
                                        this.state.remoteListPluginHandle[numLeaving].detach();
                                        delete this.state.remoteListPluginHandle[numLeaving]
                                    }
                                } else if (msg["error"] !== undefined && msg["error"] !== null) {
                                    if (msg["error_code"] == 426) {
                                        let register = {
                                            "request": "create",
                                            "room": this.state.roomId,
                                            "permanent": false,
                                            "is_private": false,
                                            "publishers": 9,
                                            "bitrate": 1048000,
                                            "opus_fec": true,
                                        };
                                        sfutest.send({"message": register});
                                    } else if (msg["error_code"] == 427) {
                                        let register = {
                                            "request": "join",
                                            "room": this.state.roomId,
                                            "ptype": "publisher",
                                            "display": myusername.toString()
                                        };
                                        sfutest.send({"message": register});
                                    }
                                }
                            }
                        }
                        if (jsep !== undefined && jsep !== null) {
                            sfutest.handleRemoteJsep({jsep: jsep});
                        }
                    },
                    onlocalstream: (stream) => {
                        if (this.state.unmount) {
                            return;
                        }
                        let videoTracks = stream.getVideoTracks();
                        if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                        } else {
                            const remoteList = this.state.remoteList;
                            remoteList[0] = stream.toURL() + "false";
                            this.setState({remoteList: remoteList});
                            // this.setState({selfViewSrc: stream.toURL()});
                            // this.setState({selfViewSrcKey: Math.floor(Math.random() * 1000)});
                        }
                    },
                    onremotestream: (stream) => {
                        // if (this.state.unmount) {
                        //     return;
                        // }
                        // let videoTracks = stream.getVideoTracks();
                        // if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                        // } else {
                        //     this.setState({mainViewSrc: stream.toURL()});
                        // }
                    },
                    oncleanup: () => {
                        console.info("oncleanup")
                    }
                });
            },
            error: (error) => {
                console.info("网络断开了")
                Global.isConnected = false;
                DeviceEventEmitter.emit('login', "janus:" + error);
            },
            destroyed: () => {
            }
        })
        this.deEmitter = DeviceEventEmitter.addListener('login', (a) => {
                if (this.state.unmount) {
                    return;
                }
                if (a != 'success') {
                    console.info("\n出错了：" + a)
                    StatusBar.setHidden(false, 'slide')
                    this.props.navigation.goBack()
                }
            }
        );
        StatusBar.setHidden(true, 'slide')

        let interval = setInterval(() => {
            if (this.state.startTimeStamp != null) {
                if (this.state.unmount) {
                    clearInterval(interval)
                    return;
                }
                const currentTimestamp = new Date().getTime();
                let remainingime = getRemainingime(currentTimestamp, this.state.startTimeStamp);
                let hour = remainingime[3];
                let min = remainingime[4];
                let second = remainingime[5];
    
                let time = null;
                if (hour == '00') {
                    if (min == '00') {
                        time = '00:' + second
                    } else {
                        time = min + ":" + second
                    }
                } else {
                    time = hour + ":" + min + ":" + second
                }
                this.setState({TimeTxt: time});
            }
        }, 1000);
    }

    
    


    publishOwnFeed(useAudio) {
        if (!this.state.publish) {
            this.setState({publish: true});
            sfutest.createOffer(
                {
                    media: {audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true, data: true},
                    success: (jsep) => {
                        var publish = {"request": "configure", "audio": useAudio, "video": true};
                        sfutest.send({"message": publish, "jsep": jsep});
                    },
                    error: (error) => {
                        Alert.alert("WebRTC error:", error);
                        if (useAudio) {
                            publishOwnFeed(false);
                        } else {
                        }
                    }
                });
        } else {
            // this.setState({ publish: false });
            // let unpublish = { "request": "unpublish" };
            // sfutest.send({"message": unpublish});
        }
    }

    newRemoteFeed(id, display) {
        let remoteFeed = null;
        janus.attach(
            {
                plugin: "janus.plugin.videoroom",
                success: (pluginHandle) => {
                    remoteFeed = pluginHandle;
                    let listen = {"request": "join", "room": this.state.roomId, "ptype": "listener", "feed": id};
                    remoteFeed.send({"message": listen});
                },
                error: (error) => {
                    Alert.alert("  -- Error attaching plugin...", error);
                },
                onmessage: (msg, jsep) => {
                    if(jsep !== undefined){
                        // jsep.sdp = jsep.sdp.replace("a=rtpmap:96 VP8/90000", "a=rtpmap:96 H264/90000")
                    }
                    let event = msg["videoroom"];
                    if (event != undefined && event != null) {
                        if (event === "attached") {
                            // Subscriber created and attached
                        }
                    }
                    if (jsep !== undefined && jsep !== null) {
                        remoteFeed.createAnswer(
                            {
                                jsep: jsep,
                                media: {audioSend: false, videoSend: false, data: true},
                                success: (jsep) => {
                                    var body = {"request": "start", "room": this.state.roomId};
                                    remoteFeed.send({"message": body, "jsep": jsep});
                                },
                                error: (error) => {
                                    Alert.alert("WebRTC error:", error)
                                }
                            });
                    }
                },
                webrtcState: (on) => {
                },
                onlocalstream: (stream) => {
                },
                onremotestream: (stream) => {
                    this.setState({info: 'One peer join!'});
                    const remoteList = this.state.remoteList;
                    const remoteListPluginHandle = this.state.remoteListPluginHandle;
                    remoteList[id] = stream.toURL() + "false";
                    remoteListPluginHandle[id] = remoteFeed;
                    const remoteStreams = this.state.remoteStreams;
                    remoteStreams[id] = stream;
                    let length = Object.keys(remoteList).length;
                    if (length <= 4) {
                        this.setState({
                            column: 2
                        })
                    } else {
                        this.setState({
                            column: 3
                        })
                    }
                    console.info(length + "拿到总人数onremotestream了 " + this.state.column)
                    this.setState({
                        remoteList: remoteList,
                        remoteListPluginHandle: remoteListPluginHandle,
                        remoteStreams: remoteStreams
                    });
                },
                oncleanup: () => {
                    if (remoteFeed.spinner !== undefined && remoteFeed.spinner !== null)
                        remoteFeed.spinner.stop();
                    remoteFeed.spinner = null;
                    if (bitrateTimer[remoteFeed.rfindex] !== null && bitrateTimer[remoteFeed.rfindex] !== null)
                        clearInterval(bitrateTimer[remoteFeed.rfindex]);
                    bitrateTimer[remoteFeed.rfindex] = null;
                },
                ondata: (data) => {
                    if (JSON.parse(data)["type"] == 'chatMsg') {
                        // let display = this.findFeed(id)[0].display;
                        this.state.chatList.push({
                            content: JSON.parse(data)["content"],
                            display,
                            time: new Date().toLocaleTimeString()
                        })
                        let messages = {
                            _id: Math.floor(Math.random() * 100000) + '',
                            text: JSON.parse(data)["content"],
                            createdAt: new Date(),
                            user: {
                                _id: id,
                                name: display
                            },
                        }
                        this.setState((previousState) => ({
                            messages: GiftedChat.append(previousState.messages, messages),
                        }))
                        this.setState({
                            chatList: this.state.chatList,
                            messages: this.state.messages
                        })
                    }
                }
            });
    }

    endCall = () => {
        this.state.remoteList = {}
        isBig = false
        this.state.roomId = null
        janus.destroy()
        StatusBar.setHidden(false, 'slide')
        this.props.navigation.goBack()
        // this.props.navigation.dispatch(StackActions.reset({
        //     index:1,
        //     actions: [
        //     NavigationActions.navigate({ routeName: 'Home' })
        //     ],
        // }))
    }

    // changeRTCViewSrc = (key = null) => {
    //     if (key) {
    //         this.setState({
    //             mainViewSrc: this.state.remoteList[key],
    //             currentId: key
    //         })
    //     } else {
    //         this.setState({
    //             mainViewSrc: this.state.selfViewSrc,
    //             currentId: ''
    //         })
    //     }
    // }

    sendMsg = () => {
        var text = JSON.stringify({
            type: 'chatMsg',
            content: this.state.text
        });
        sendData({
            text,
            success: () => {
                let chatLists = this.state.chatList
                chatLists.push({
                    content: this.state.text,
                    display: myusername,
                    time: new Date().toLocaleTimeString()
                })
                this.setState({
                    chatList: chatLists
                })
                // if(this.refs.flatList){
                //   this.refs.flatList.scrollToIndex({index: this.state.chatList.length-1,viewOffset:40, viewPosition: 1})
                // }

            },
            error: (reason) => {
                console.log(reason);
            },
        })
    }

    endEdit = () => {
        if (this.state.text !== '') {
            this.sendMsg();
        }
        this.setState({
            text: ''
        })
    }

    findFeed = (id) => {
        return this.state.roomList.filter((v, i) => {
            if (v.id == id) {
                return v.display
            }
        })
    }
    switchVideoType = () => {
        if (isFront) {
            this.refs.toast.show('切换后置摄像头');
        } else {
            this.refs.toast.show('切换前置摄像头');
        }
        sfutest.changeLocalCamera(isFront);
        isFront = !isFront;
    }

    toggleVideoMute = () => {
        let muted = sfutest.isVideoMuted();
        if (muted) {
            this.setState({
                videoMute: false,
                videoImage: require('../icon/ic_videocam_white_48dp.png')
            });
            sfutest.unmuteVideo();
            this.state.isVideoOpen = true;
        } else {
            this.setState({
                videoMute: true,
                videoImage: require('../icon/ic_videocam_off_white_48dp.png')
            });
            sfutest.muteVideo();
            this.state.isVideoOpen = false;

        }
    }

    toggleSpeaker = () => {
        if (this.state.speaker) {
            this.setState({
                speaker: false,
                soundImage: require('../icon/ic_volume_off_white_48dp.png')
            });
            InCallManager.setSpeakerphoneOn(false)
        } else {
            this.setState({
                speaker: true,
                soundImage: require('../icon/ic_volume_up_white_48dp.png')
            });
            InCallManager.setSpeakerphoneOn(true)
        }
    }

    toggleAudioMute = () => {
        // this.props.App.test()
        let muted = sfutest.isAudioMuted();
        if (muted) {
            sfutest.unmuteAudio();
            this.setState({
                audioMute: false,
                audioImage: require('../icon/ic_mic_white_48dp.png')
            });
        } else {
            sfutest.muteAudio();
            this.setState({
                audioMute: true,
                audioImage: require('../icon/ic_mic_off_white_48dp.png')
            });

        }
    }

    remoteMute = () => {
        var text = JSON.stringify({
            type: 'muteRequest',
            content: {target: this.state.currentId}
        });
        if (this.state.remoteMute) {
            this.setState({remoteMute: false})
        } else {
            this.setState({remoteMute: true})
            sendData({
                text,
                success: () => {

                },
                error: (reason) => {
                    console.log(reason)
                }
            })
        }
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            console.log(this.state.messages)
            var text = JSON.stringify({
                type: 'chatMsg',
                content: this.state.messages[0].text
            });
            sendData({
                text,
                success: () => {

                },
                error: (reason) => {
                    console.log(reason);
                }
            })
        })
    }

    _selectItemPress = (item) => {
        console.info("item 为：" + (item.indexOf("true") > 0))
        if (this.state.remoteList == null) {
            return;
        }
        let list = Object.values(this.state.remoteList);
        if (this.state.column == 3) {
            let tag;
            for (let i = 0; i < list.length; i++) {
                if (list[i] == item) {
                    tag = i;
                    if (isBig) {
                        tag = bigView
                    }
                    console.info("tag是：" + tag)

                    if (tag === 0) {
                        if ((isBig && bigView === 0) || !isBig) {
                            this.setState({
                                translateX: 0,
                                // translateY: Dimensions.get('window').width / 3,
                            })
                            bigView = 0
                            isBig = !isBig
                        }
                    } else if (tag === 3) {
                        if ((isBig && bigView === 3) || !isBig) {
                            this.setState({
                                translateX: 0,
                                translateY: 0,
                            })
                            bigView = 3
                            isBig = !isBig
                        }
                    } else if (tag === 6) {
                        if ((isBig && bigView === 6) || !isBig) {
                            this.setState({
                                translateX: 0,
                                translateY: -Dimensions.get('window').width / 3,
                            })
                            bigView = 6
                            isBig = !isBig
                        }
                    } else if (tag === 9) {
                        if ((isBig && bigView === 9) || !isBig) {
                            this.setState({
                                translateX: 0,
                                translateY: -Dimensions.get('window').width / 1.5,
                            })
                            bigView = 9
                            isBig = !isBig
                        }
                    } else if (tag === 1) {
                        if ((isBig && bigView === 1) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 3,
                                translateY: Dimensions.get('window').width / 3,

                            })
                            bigView = 1
                            isBig = !isBig

                        }
                    } else if (tag === 4) {
                        if ((isBig && bigView === 4) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 3,
                                translateY: 0,
                            })
                            bigView = 4
                            isBig = !isBig

                        }
                    } else if (tag === 7) {
                        if ((isBig && bigView === 7) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 3,
                                translateY: -Dimensions.get('window').width / 3,
                            })
                            bigView = 7
                            isBig = !isBig

                        }
                    } else if (tag === 10) {
                        if ((isBig && bigView === 10) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 3,
                                translateY: -Dimensions.get('window').width / 1.5,
                            })
                            bigView = 10
                            isBig = !isBig

                        }
                    } else if (tag === 2) {
                        if ((isBig && bigView === 2) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 1.5,
                                translateY: Dimensions.get('window').width / 3,
                            })
                            bigView = 2
                            isBig = !isBig
                        }
                    } else if (tag === 5) {
                        if ((isBig && bigView === 5) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 1.5,
                                translateY: 0,
                            })
                            bigView = 5
                            isBig = !isBig
                        }
                    } else if (tag === 8) {
                        if ((isBig && bigView === 8) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 1.5,
                                translateY: -Dimensions.get('window').width / 3,
                            })
                            bigView = 8
                            isBig = !isBig
                        }
                    } else if (tag === 11) {
                        if ((isBig && bigView === 11) || !isBig) {
                            this.setState({
                                translateX: -Dimensions.get('window').width / 1.5,
                                translateY: -Dimensions.get('window').width / 1.5,
                            })
                            bigView = 11
                            isBig = !isBig
                        }
                    }

                    if (list[tag].indexOf('true') > 0) {
                        list[tag] = list[tag].replace('true', 'false')
                    } else {
                        list[tag] = list[tag].replace('false', 'true')
                    }
                }
            }
        } else {
            let tag;
            for (let i = 0; i < list.length; i++) {
                if (list[i] == item) {
                    tag = i;
                    if (isBig) {
                        tag = bigView
                    }
                    console.info("tag是：" + tag)

                    if (tag === 0) {
                        if ((isBig && bigView === 0) || !isBig) {
                            this.setState({
                                translateX: 0,
                                translateY: 0,

                            })
                            bigView = 0
                            isBig = !isBig
                        }
                    } else if (tag === 1) {
                        if ((isBig && bigView === 1) || !isBig) {
                            this.setState({
                                // translateX: -Dimensions.get('window').width / 2,
                                translateX: 0,
                                translateY: 0,
                            })
                            bigView = 1
                            isBig = !isBig
                        }
                    } else if (tag === 2) {
                        if ((isBig && bigView === 2) || !isBig) {
                            this.setState({
                                translateX: 0,
                                translateY: 0,
                                // translateY: -Dimensions.get('window').width / 2,
                            })
                            bigView = 2
                            isBig = !isBig
                        }
                    } else if (tag === 3) {
                        if ((isBig && bigView === 3) || !isBig) {
                            this.setState({
                                // translateX: -Dimensions.get('window').width / 2,
                                // translateY: -Dimensions.get('window').width / 2,
                                translateX: 0,
                                translateY: 0,
                            })
                            bigView = 3
                            isBig = !isBig
                        }
                    }

                    if (list[tag].indexOf('true') > 0) {
                        list[tag] = list[tag].replace('true', 'false')
                    } else {
                        list[tag] = list[tag].replace('false', 'true')
                    }
                }
            }

        }

        let assign = Object.assign({}, list);
        this.setState({remoteList: assign})
    }
    _keyExtractor = (item, index) => index;


    render() {
        return (
            <View style={(this.state.curOrt == 'PORTRAIT') ? styles.ViewStyle : styles2.ViewStyle2}>
                <ImageBackground source={require('../icon/back.png')}
                                 style={(this.state.curOrt == 'PORTRAIT') ? styles.ViewStyle : styles2.ViewStyle2}>
                    <Text style={{marginTop:5},[styles.TitleStyle]}>{this.state.roomId}</Text>
                    <Text style={[IsIOS?styles.TimeText:styles.TitleStyle]}>{this.state.TimeTxt}</Text>
                    <ScrollView style={(this.state.curOrt == 'PORTRAIT') ? styles.changeView : styles2.changeView}>
                        <FlatList
                            key={this.state.column}
                            keyExtractor={this._keyExtractor}
                            extraData={this.state}
                            numColumns={this.state.column}
                            style={{width: height > width ? width : height}}
                            data={Object.values(this.state.remoteList).map(item => item)}
                            renderItem={({item}) =>
                                <TouchableOpacity
                                    onPress={
                                        _ => this._selectItemPress(item)
                                    }
                                >
                                    <RTCView
                                        objectFit='cover'
                                        streamURL={item.substring(0, 36)}
                                        style={(this.state.curOrt == 'PORTRAIT') ? {
                                            display: (item.indexOf("false") > 0 && isBig) ? 'none' : 'flex',
                                            backgroundColor: '#999',
                                            width: item.indexOf("true") > 0 ? width : (Dimensions.get('window').width / this.state.column),
                                            height: item.indexOf("true") > 0 ? width : (Dimensions.get('window').width / this.state.column),
                                           
                                            ...Platform.select({
                                                ios: {
                                                     marginTop:item.indexOf("true") > 0 ? (height -  width - 100 - ViewPositionTop)/2 : 0,
                                                },
            
                                            })

                                        } : styles2.remoteView}
                                        zOrder={item.indexOf("true") > 0 ? 99 : 0}/>
                                </TouchableOpacity>
                            }
                        />
                    </ScrollView>
                    <View style={{
                        position: "absolute",
                        right: 0,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.switchVideoType()
                            }}
                        >
                            <Image source={require('../icon/switch_camera.png')}
                                   style={{
                                       height: 40, width: 40,  marginEnd: 10,
                                       ...Platform.select({
                                        ios: {
                                            marginTop: stateBar,
                            
                                        },
                                        android:{
                                            marginTop: 10
                                        }
                                    })
                                   }}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.BottomView}>
                        <TouchableOpacity
                            onPress={() => {
                                this.toggleAudioMute()
                            }}
                        >
                            <View style={{justifyContent: 'center'}}>
                                <Image source={this.state.audioImage} style={{
                                    marginLeft: 30,
                                    marginRight: 10,
                                    width: 45,
                                    height: 45,
                                }}/>
                                <Text style={(this.state.curOrt == 'PORTRAIT') ? {
                                    marginLeft: 20,
                                    textAlign: 'center',
                                    marginTop: 5,
                                    color: '#fff',
                                } : {
                                    marginLeft: 20,
                                    textAlign: 'center',
                                    marginTop: 2,
                                    color: '#fff',
                                }}>麦克风</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.toggleSpeaker()
                            }}
                        >
                            <View style={{justifyContent: 'center'}}>
                                <Image source={this.state.soundImage} style={styles.BottomIcon}/>
                                <Text
                                    style={(this.state.curOrt == 'PORTRAIT') ? styles.TextStyle : styles2.TextStyle}>扬声器</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.toggleVideoMute()
                            }}>
                            <View style={{justifyContent: 'center'}}>
                                <Image source={this.state.videoImage} style={styles.BottomIcon}/>
                                <Text
                                    style={(this.state.curOrt == 'PORTRAIT') ? styles.TextStyle : styles2.TextStyle}>摄像头</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.endCall()
                            }}
                        >
                            <View style={{justifyContent: 'center'}}>
                                <Image source={require('../icon/hangup_call.png')} style={{
                                    marginLeft: 10,
                                    marginRight: 30,
                                    width: 45,
                                    height: 45,
                                }}/>
                                <Text style={(this.state.curOrt == 'PORTRAIT') ? {
                                    marginRight: 20,
                                    textAlign: 'center',
                                    marginTop: 5,
                                    color: '#fff',
                                } : {
                                    marginRight: 20,
                                    textAlign: 'center',
                                    marginTop: 2,
                                    color: '#fff',
                                }}>挂断</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <Toast ref="toast" fadeOutDuration={0}/>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ViewStyle: {
        width: height > width ? width : height,
        height: height > width ? height : width,
        alignItems: 'center',
    },
    gridView: {
        position: 'absolute',
        marginTop: 10,
    },
    itemContainer: {
        borderRadius: 5,
        padding: 5,
        height: 90,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },


    container: {
        display: 'none',
        // flex: 1,
        // justifyContent: 'center',
        // backgroundColor: '#fff',
        // marginBottom: 10
        top: 200,
        position: "absolute",
        // backgroundColor: '#FC0A33',
        width: 140,
        height: 240,
        backgroundColor: '#555'

    },
    mainView: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#555',
        marginTop: Dimensions.get('window').height / 1.7,
        width: height > width ? width / 2.5 : height / 2.5,
        height: height > width ? width / 2 : height / 2,
    },

    viewBtn: {
        flex: 1,
        justifyContent: 'space-between',
        position: 'absolute',
        top: 10,
        right: 20,
        height: Dimensions.get('window').height / 2.3,
    },
    changeView: {
        marginTop: 35,
        flexDirection: "row",
        position: "absolute",
        // backgroundColor: '#fff',
        width: height > width ? width : height,
        height: height > width ? height - 100 - bottomHeight : width - 100 - bottomHeight,
        ...Platform.select({
            ios: {
                marginTop: ViewPositionTop + 35,
            },

        })
    },
    selfView: {
        backgroundColor: '#999',
        width: width / 3.06,
        height: Dimensions.get('window').height / 5,
        margin: 1
        //   transform: [{rotate:'90deg'}]
    },
    remoteView: {
        backgroundColor: '#999',
        width: Dimensions.get('window').width / 3.06,
        height: Dimensions.get('window').height / 5,
        margin: 1,
    },
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
        height: Dimensions.get('window').height - Dimensions.get('window').height / 2 - Dimensions.get('window').height / 5 - 40,
        backgroundColor: '#fff'
    },
    chatLists: {
        flex: 3,
        marginBottom: 40
    },
    chatUser: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    sendContainer: {
        height: 40,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff'
    },
    sendInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        flex: 3
    },
    sendBtn: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },

    ViewStyle2: {
        width: width,
        height: height,
        alignItems: 'center',
    },
    TopStyle: {
        position: "absolute",
        flexDirection: 'row',
        width: width,
        height: 70,
        marginTop: isIphoneX ? 20 : 0
    },
    BackStyle: {
        backgroundColor: '#CDCDCD',
        width: 60,
        height: 35,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    backIcon: {
        width: 25,
        height: 25,
    },
    TitleStyle: {
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        ...Platform.select({
            ios: {
                
                marginTop: isIphoneX?stateBar:5,
            }
        })
    },
    TimeText:{
        textAlign: 'center', 
        fontSize: 16,
        color: 'white',
        marginTop:5,
    },
    Reloation: {
        width: 40,
        height: 40,
    },
    BottomView: {
        flex: 1,
        alignItems: 'center',
        // backgroundColor: '#666',
        width: height > width ? width : width / 4,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: bottomHeight,
    },
    BottomIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 45,
        height: 45,
    },
    TextStyle: {
        textAlign: 'center',
        marginTop: 5,
        color: '#fff',
    },
});


const styles2 = StyleSheet.create({
    remoteView: {
        // backgroundColor: '#999',
        // width: height > width ? height / 5 : width / 5,
        // height: height > width ? width / 3.5 : height / 3.5,
        // margin: 1,
    },
    ViewStyle2: {
        width: height > width ? height : width,
        height: height > width ? width : height,
        alignItems: 'center',
    },
    changeView: {
        flexDirection: 'row',
        position: "absolute",
        alignSelf: "flex-start",
        // backgroundColor: '#00FF40',
        marginLeft: 20,
        height: height > width ? width / 2 : height / 2,
        marginTop: 35,
        width: height > width ? height / 1.5 : width / 1.5,
        ...Platform.select({
            ios: {
                marginTop: stateBar + 45,
            },

        })
    },
    gridView: {
        position: 'absolute',
        marginTop: 10,
    },
    mainView: {
        // backgroundColor:'#fff',
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 20,
        marginTop: 80,
        width: height > width ? height / 4 : width / 4,
        height: height > width ? width / 2.5 : height / 2.5,
    },
    TopStyle: {
        position: "absolute",
        flexDirection: 'row',
        width: height,
        height: 70,
        marginTop: isIphoneX ? 20 : 0
    },
    BackStyle: {
        backgroundColor: '#CDCDCD',
        width: 60,
        height: 35,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    backIcon: {
        width: 25,
        height: 25,
    },
    TitleStyle:{
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 18,
        color: 'white',
        ...Platform.select({
            ios: {
                marginTop: stateBar + 10,

            },
            android:{
                paddingTop: 18,
            }
        })
    },
    Reloation: {
        width: 40,
        height: 40,
    },
    BottomView: {
        flex: 1,
        alignItems: 'center',
        width: height > width ? width : width / 4,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: bottomHeight2,
    },
    BottomIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 45,
        height: 45,
    },
    TextStyle: {
        textAlign: 'center',
        marginTop: 2,
        color: '#fff',
    },
    selfView: {
        position: "absolute",
        // backgroundColor: '#00FF40',
        width: height + 80,
        height: width + 20,
    },
})

export default Main;
