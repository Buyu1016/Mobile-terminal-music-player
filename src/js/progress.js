/**
 * 进度条控制和渲染
 */
(function(root) {
    // 进度条构造函数
    class Progress {
        constructor() {
            //总时长
            this.totalTime = 0;
            // 定时器
            this.frameId = null;
            // 当前播放时长
            this.presetTime = 0;
            // 记录暂停时的时长
            this.lastTime = 0;
        };
        // 初始化
        init() {
            this.getDom();
        };
        // 获取元素
        getDom() {
            this.musicDot = document.querySelector(".music__dot");
            this.musicArrive = document.querySelector(".music__arrive");
            this.musicStartTime = document.querySelector(".music__startTime");
            this.musicEndTime = document.querySelector(".music__endTime");
        };
        // 渲染时间
        renderAllTime(time) {
            this.totalTime = time;
            this.musicEndTime.innerText = this.formatTime(time);
        };
        // 处理时间的格式
        formatTime(time) {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${seconds}`;
        };
        // 移动进度条
        moveProgress(pre) {
            cancelAnimationFrame(this.frameId);
            this.lastTime = pre === undefined ? this.lastTime : pre;
            this.startTime = new Date().getTime();
            const _THIS = this;

            function frame() {
                let curTime = new Date().getTime();
                // 百分比值
                let differenceTime = _THIS.lastTime + (curTime - _THIS.startTime) / (_THIS.totalTime * 1000);
                // 过界判断
                if (differenceTime <= 1) {
                    // 歌曲暂未播放完成
                    // 一直刷新进度条
                    _THIS.updateProgress(differenceTime);
                } else {
                    // 歌曲播放完成
                    // 关闭关键帧动画
                    cancelAnimationFrame(_THIS.frameId);
                }
                // H5关键帧动画
                _THIS.frameId = requestAnimationFrame(frame);
            }
            frame();
        };
        // 更新Bar
        updateProgress(differenceTime) {
            // 更新当前时间
            let time = this.formatTime(Math.round(differenceTime * this.totalTime));
            this.musicStartTime.innerText = time;
            // 更新进度条
            this.musicArrive.style.width = `${differenceTime * 100}%`;
            // 更新dor位置
            let l = differenceTime * this.musicDot.parentNode.offsetWidth;
            this.musicDot.style.transform = `translate(${l}px,-50%)`;
        };
        // 停止进度条
        stopProgress() {
            cancelAnimationFrame(this.frameId);
            const stopTime = new Date().getTime();
            this.lastTime += (stopTime - this.startTime) / (this.totalTime * 1000);
        };
    }

    function instanceProgress() {
        return new Progress();
    }
    // 拖拽构造函数
    class Drag {
        constructor(obj) {
            // 拖拽的元素
            this.obj = obj;
            // 拖拽时按下的坐标
            this.startPointX = 0;
            // 按下时已经走的距离
            this.startLeft = 0;
            // 拖拽所占的百分比
            this.percent = 0;
        };
        init() {
            this.obj.style.transform = "translate(0,-50%)";
            // 拖拽开始
            this.obj.addEventListener('touchstart', (e) => {
                // 移动端知识点 changedTouches  触发当前时间的手指列表
                this.startPointX = e.changedTouches[0].pageX;
                // 取到translate(0px,-50%);中的 0
                this.startLeft = parseInt(((this.obj.style.transform.split("("))[1].split(","))[0]);
                this.start && this.start();
            });
            // 拖拽进行中
            this.obj.addEventListener('touchmove', (e) => {
                // 计算出拖拽所移动距离
                this.disPointX = e.changedTouches[0].pageX - this.startPointX;
                // 当前小圆点所在位置
                let distance = this.startLeft + this.disPointX;
                // 限制是否过界 
                if (distance < 0) {
                    distance = 0;
                    // offsetParent就是距离该子元素最近的进行过定位的父元素
                } else if (distance > this.obj.offsetParent.offsetWidth) {
                    distance = this.obj.offsetParent.offsetWidth;
                }
                this.obj.style.transform = `translate(${distance}px,-50%)`;
                this.percent = distance / this.obj.offsetParent.offsetWidth;
                this.move && this.move(this.percent);
            });
            // 拖拽结束
            this.obj.addEventListener("touchend", (e) => {
                this.end && this.end(this.percent);
            });
        }
    }

    function instanceDrag(obj) {
        return new Drag(obj);
    }
    root.progress = {
        progress: instanceProgress,
        drag: instanceDrag,
    }
})(window.player || (window.player = {}))