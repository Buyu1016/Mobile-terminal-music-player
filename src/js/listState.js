/**
 * 此模块为自己所想
 * 用于列表的展开和收缩
 */
(function(root) {

    class listState {
        constructor(dom) {
            this.dom = dom;
            this.state = "shrink"; //默认状态为shrink
        };
        //列表展开
        listUnfold() {
            this.dom.style.bottom = "0";
            this.dom.style.transform = "";
            this.dom.style.pointerEvents = "all";
            this.state = "unfold";
        };
        listShrink() {
            this.dom.style.transform = "translateY(100%)";
            this.state = "shrink";
            this.dom.style.pointerEvents = "none";
        }
    }
    const oListBtn = document.querySelector(".music__list");
    root.listControl = new listState(oListBtn);
})(window.player || (window.player = {}))