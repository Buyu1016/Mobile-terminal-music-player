/**
 * 渲染模块
 *      用于渲染图片，音乐信息，是否喜欢
 */
(function(root) {
    /**
     * 用于处理图片为高斯模糊
     * @param {*} imgSrc	图片路径 
     */
    function renderImg(imgSrc) {
        root.blurImg(imgSrc);
        const oImg = document.querySelector(".music__img img");
        oImg.src = imgSrc;
    }
    /**
     * 用于渲染歌曲信息
     * @param {*} songInfo	歌曲信息 
     */
    function renderInfo(songInfo) {
        const oSongName = document.querySelector(".music__name");
        const oSongSinger = document.querySelector(".music__singer");
        const oSongAlbum = document.querySelector(".music__album");
        oSongName.innerText = songInfo.name;
        oSongSinger.innerText = songInfo.singer;
        oSongAlbum.innerText = songInfo.album;
    }
    /**
     * 用于渲染歌曲是否喜欢
     * @param {*} songLike	歌曲是否喜欢 
     */
    function renderIsLike(songLike) {
        const oSongLike = document.querySelector(".music__menu ul li:nth-child(1)");
        if (songLike === true) {
            oSongLike.className = "music__like";
        } else {
            oSongLike.className = "";
        }
    }
    /**
     * 用于渲染musicList列表
     * @param {*} songName 
     */
    function renderListSong(songName) {
        const oDl = document.querySelector(".music__list dl");
        for (const item of songName) {
            const createDd = document.createElement("dd");
            createDd.innerText = item.name;
            oDl.appendChild(createDd);
        }
    }
    /**
     * 用于渲染musicList中当前播放音乐的颜色
     * @param {*} dataName 
     */
    function renderNowSong(dataName, dataAll) {
        const arr1 = [];
        for (const iterator of dataAll) {
            arr1.push(iterator.name);
        }
        const index = arr1.findIndex((data) => {
            return data == dataName;
        });
        const oDdAll = document.querySelectorAll(".music__list dl dd");
        for (const item of oDdAll) {
            item.className = "";
        }
        oDdAll[index].className = "music__list_now";
    }
    root.renderList = function(dataAll) {
        renderListSong(dataAll);
    }
    root.renderAll = function(data, dataAll) {
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
        renderNowSong(data.name, dataAll);
    };

})(window.player || (window.player = {}))