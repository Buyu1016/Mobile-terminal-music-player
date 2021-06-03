(function(root) {
    class AudioManage {
        constructor() {
            this.audio = new Audio(); //audio示例
            this.state = "pause"; //当前播放状态
        };
        // 加载music
        load(src) {
            this.audio.src = src;
            this.audio.load();
        };
        //播放music
        playMusic() {
            this.audio.play();
            this.state = "play";
        };
        //暂停music
        pauseMusic() {
            this.audio.pause();
            this.state = "pause";
        };
        /**
         * 音乐播放完成之后触发的事件
         * @param {*} fun   回调函数 
         */
        musicAccomplish(fun) {
            this.audio.onended = fun;
        };
        /**
         * 音乐拖拽跳转时间点
         * @param {*} time  跳转到的时间点(s)
         */
        playTo(time) {
            this.audio.currentTime = time;
        }
    }
    root.musicControl = new AudioManage();
})(window.player || (window.player = {}))