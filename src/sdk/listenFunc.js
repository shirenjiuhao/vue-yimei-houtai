/**
 * Created by Administrator on 2017/2/27.
 */

const conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});

conn.listen({
    onOpened: function ( message ) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        console.log('连接成功');
    },
    onClosed: function ( message ) {
        console.log('已退出登录')
    },         //连接关闭回调
    onTextMessage: function ( message ) {
        console.log(message);
         msgShow('receiver','text',message.data,getShowDate());
         msgScrollTop();
    },    //收到文本消息
    onEmojiMessage: function ( message ) {
        console.log('Emoji');
        var data = message.data;
        for(var i = 0 , l = data.length ; i < l ; i++){
            console.log(data[i]);
        }
    },   //收到表情消息
    onPictureMessage: function ( message ) {
        console.log('Picture');

        var options = {url: message.url};
        options.onFileDownloadComplete = function () {
            // 图片下载成功
            msgShow('receiver','img',message.url,getShowDate());
            msgScrollTop()
            console.log('Image download complete!');
        };
        options.onFileDownloadError = function () {
            // 图片下载失败
            console.log('Image download failed!');
        };
        WebIM.utils.download.call(conn, options);
    }, //收到图片消息
    onCmdMessage: function ( message ) {},     //收到命令消息
    onAudioMessage: function ( message ) {},   //收到音频消息
    onLocationMessage: function ( message ) {},//收到位置消息
    onFileMessage: function ( message ) {},    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
                'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {},       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {},         //处理好友申请
    onInviteMessage: function ( message ) {},  //处理群组邀请
    onOnline: function (message) {console.log(message)},                  //本机网络连接成功
    onOffline: function (message) {
        console.log(message)
    },                 //本机网络掉线
    onError: function ( message ) {
        console.log(message);
        console.log('连接失败，请重新登录');
        //alert('请您先登录');
        window.location.replace('#/login');
    },          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
});
//是否能上传file
WebIM.utils.isCanUploadFile;
//是否能下载file
WebIM.utils.isCanDownLoadFile ;
//是否设置header
WebIM.utils.hasSetRequestHeader;
//是否设置mimetype
WebIM.utils.hasOverrideMimeType;

//滚动定位
var msgScrollTop = function(){
    $(msgInit.el)[0].scrollTop = $(msgInit.el)[0].scrollHeight + $(msgInit.el)[0].offsetHeight;
}
//发送文本消息
var sendPrivateText = function(messages,toUno){
    let id = conn.getUniqueId();                 // 生成本地消息id
    let msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: messages,                  // 消息内容
        to: toUno,    // 接收消息对象（用户id）
        ext: {"msgType":1},
        roomType: false,
        success: function (id, serverMsgId) {
            console.log('send private text Success');
            let time = getShowDate()
            console.log(msg)
            let content = msg.value;
            msgShow('sender','text',content,time);
            msgScrollTop();
        }
    });
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);
 }
 //发送图片消息
 /*document.addEventListener('paste', function (e) {
    if (e.clipboardData && e.clipboardData.types) {
        if (e.clipboardData.items.length > 0) {
            if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
                var blob = e.clipboardData.items[0].getAsFile();
                var url = window.URL.createObjectURL(blob);
                var id = conn.getUniqueId();             // 生成本地消息id
                var msg = new WebIM.message('img', id);  // 创建图片消息
                msg.set({
                    apiUrl: WebIM.config.apiURL,
                    file: {data: blob, url: url},
                    to: 'username',                      // 接收消息对象
                    roomType: false,
                    chatType: 'singleChat',
                    onFileUploadError: function (error) {
                        console.log('Error');
                    },
                    onFileUploadComplete: function (data) {
                        console.log('Complete');
                    },
                    success: function (id) {
                        console.log('Success');
                    }
                });
                conn.send(msg.body);
            }
        }
    }
});*/
// 发送图片消息
var sendPrivateImg = function (imgSrc,toUno) {
        var id = conn.getUniqueId();
        var msg = new WebIM.message('img', id);
        var input = document.getElementById('image');            // 选择图片的input
        var file = WebIM.utils.getFileUrl(input);                   // 将图片转化为二进制文件
        var allowType = {
            'jpg': true,
            'gif': true,
            'png': true,
            'bmp': true
        };
        if (file.filetype.toLowerCase() in allowType) {
            console.log('send');
            //console.log(file);
            var option = {
                apiUrl: WebIM.config.apiURL,
                file: file,
                to: toUno ,
                ext: {"msgType":2},
                roomType: false,
                chatType: 'singleChat',
                onFileUploadError: function () {
                    console.log('onFileUploadError');
                },
                onFileUploadComplete: function () {
                    console.log('onFileUploadComplete'+' 发送成功');
                },
                success: function () {
                    let time = getShowDate();
                    console.log('Success');
                    msgShow('sender','img',imgSrc,time);
                    msgScrollTop();
                },
                // flashUpload: WebIM.flashUpload               // 意义待查
            };
            msg.set(option);
            conn.send(msg.body);
        }
};
var sendPrivateInfo = function (messages,toUno) {
    var id = conn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: messages,                  // 消息内容
        to: toUno, 
        ext: {"msgType":3},                         // 接收消息对象（用户id）
        roomType: false,
        success: function (id, serverMsgId) {
            console.log('send private Info Success');
            let time = getShowDate()
            console.log(msg)
            let content = msg.value;
            msgShow('sender','info',content,time);
            msgScrollTop();
        }
    });
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);
};