(function(Zepto, player) {
    class MusicPlayer {
        constructor(dom) {
            this.wrap = dom; //播放容器
            this.dataList = []; //请求到的数据
            this.now = 0; //歌曲的索引
            this.imgRotateTimer = null;
            this.progress = player.progress.progress();
        };
        init() {
            this.getDom();
            this.getData("../mock/data.json");
        };
        getDom() {
            // 获取元素
            this.record = document.querySelector(".music__img img");
            this.controlBtns = document.querySelectorAll(".music__menu ul li");
            this.oListClose = document.querySelector(".music__close");
            this.oMusicDot = document.querySelector(".music__dot");
        };
        /**
         * 请求数据
         * @param {*} url   请求地址 
         */
        getData(url) {
            $.ajax({
                url: url,
                method: "get",
                success: data => {
                    this.dataList = data;
                    player.renderList(data);
                    this.progress.init();
                    this.loadMusic(this.now);
                    this.musicControl();
                    this.musicListControl();
                    this.dragControl();
                },
                error: () => {
                    throw new Error("请求失败！");
                }
            })
        };
        loadMusic(index) {
            player.renderAll(this.dataList[index], this.dataList);
            player.musicControl.load(this.dataList[index].audioSrc);
            this.progress.renderAllTime(this.dataList[this.now].duration);
            if (player.musicControl.state === "play") {
                player.musicControl.playMusic();
                this.controlBtns[2].className = "music__pause";
                this.imgRotate(0);
                this.progress.moveProgress(0);
            }
            player.musicControl.musicAccomplish(() => {
                if (this.now === this.dataList.length - 1) {
                    this.now = 0;
                } else {
                    this.now++;
                }
                this.loadMusic(this.now);
            });
        };
        // 拖拽控制
        dragControl() {
            let dragDot = player.progress.drag(this.oMusicDot);
            dragDot.init();
            // 按下圆点e
            dragDot.start = () => {
                player.musicControl.pauseMusic();
            };
            // 拖拽圆点
            dragDot.move = (per) => {
                this.progress.moveProgress(per);
                // this.progress.updateProgress(per);
            };
            // 拖拽结束
            dragDot.end = (per) => {
                let endTime = per * this.dataList[this.now].duration;
                player.musicControl.playTo(endTime);
                player.musicControl.playMusic();
                this.progress.moveProgress(per);
                this.controlBtns[2].className = "music__pause";
            }
        };
        // 控制列表展示
        musicListControl() {
            this.oListBtnAll = document.querySelectorAll(".music__list dl dd");
            this.controlBtns[4].addEventListener("touchend", () => {
                if (player.listControl.state === "shrink") {
                    player.listControl.listUnfold();
                }
            });
            this.oListClose.addEventListener("touchend", () => {
                if (player.listControl.state === "unfold") {
                    player.listControl.listShrink();
                }
            });
            //循环事件，并在触发时进行获取，并进行切换歌曲和
            this.oListBtnAll.forEach((self, index) => {
                self.addEventListener("touchend", (e) => {
                    if (player.musicControl.state === "play" && self.className === "music__list_now") {
                        return;
                    }
                    this.loadMusic(index);
                    player.musicControl.playMusic();
                    this.controlBtns[2].className = "music__pause";
                    if (player.listControl.state === "unfold") {
                        player.listControl.listShrink();
                    }
                });
            });
        };
        // 控制音乐
        musicControl() {
            // 上一首
            this.controlBtns[1].addEventListener("touchend", () => {
                player.musicControl.state = "play";
                if (this.now === 0) {
                    this.now = this.dataList.length - 1;
                } else {
                    this.now--;
                }
                this.loadMusic(this.now);
            });
            // 暂停和播放
            this.controlBtns[2].addEventListener('touchend', () => {
                if (player.musicControl.state === "pause") { //当前为播放
                    player.musicControl.playMusic();

                    if (this.record.getAttribute("data-rotate") === "null") {
                        this.imgRotate(0);
                    } else {
                        this.imgRotate(this.record.getAttribute("data-rotate"))
                    }
                    this.controlBtns[2].className = "music__pause";
                    this.progress.moveProgress();
                } else {
                    player.musicControl.pauseMusic();
                    this.stopImgRotate();
                    this.controlBtns[2].className = "";
                    this.progress.stopProgress();
                }
            });
            //下一首
            this.controlBtns[3].addEventListener('touchend', () => {
                player.musicControl.state = "play";
                if (this.now === this.dataList.length - 1) {
                    this.now = 0;
                } else {
                    this.now++;
                }
                this.loadMusic(this.now);
            })
        };
        /**
         * 播放音乐时图片进行旋转
         * @param {*} deg 
         */
        imgRotate(deg) {
            clearInterval(this.imgRotateTimer);
            this.imgRotateTimer = setInterval(() => {
                deg = +deg + 0.2;
                if (deg >= 360) {
                    deg = 0;
                }
                this.record.style.transform = `rotate(${deg}deg)`;
                // 将旋转角度存放到标签上，为了当暂停后再次播放时能够进行接着进行图片旋转
                this.record.dataset.rotate = deg;
            }, 1000 / 60);
        };
        stopImgRotate() {
            clearInterval(this.imgRotateTimer);
        }
    }
    const musicPlayer = new MusicPlayer(document.querySelector(".music__wrapper"));
    musicPlayer.init();
})(window.Zepto, window.player);