/* global Fluid, CONFIG */
//异步加载资源
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
  }
//初始化pjax
function pjax_init(){
  document.addEventListener('pjax:send', function() {
      NProgress.start();
  });
  document.addEventListener('pjax:error', function() {
  });
  document.addEventListener('pjax:success', function() {
    //需要重建的js 从next主题复制来的 
    document.querySelectorAll('script[pjax], #pjax script').forEach(element => {
    var code = element.text || element.textContent || element.innerHTML || '';
    var parent = element.parentNode;
    parent.removeChild(element);
    var script = document.createElement('script');
    if (element.id) {
      script.id = element.id;
    }
    if (element.className) {
      script.className = element.className;
    }
    if (element.type) {
      script.type = element.type;
    }
    if (element.src) {
      script.src = element.src;
      // Force synchronous loading of peripheral JS.
      script.async = false;
    }
    if (element.getAttribute('pjax') !== null) {
      script.setAttribute('pjax', '');
    }
    if (code !== '') {
      script.appendChild(document.createTextNode(code));
    }
    parent.appendChild(script);
  });
  });
document.addEventListener('DOMContentLoaded', function() {
      var pjax = new Pjax({
    elements: 'a[href]:not([href^="#"]):not([href="javascript:void(0)"])',
    selectors: ["main","title","body div#banner","meta[name=description]"],
    //三个分别是容器 标题 头图
  debug: false,cacheBust: false
});
var homeURL=document.location.protocol+'//'+document.location.host+'/'; //主页网址
if(document.URL === homeURL){
  slogan(window,document);
}else{
  Fluid.plugins.typing(document.getElementById('subtitle').title); //打字机
}
var loaded=false; //是否已加载资源
document.addEventListener('pjax:complete', function(){ //PJAX重载
  if(document.URL === homeURL){
    slogan(window,document);
  }else{
    Fluid.plugins.typing(document.getElementById('subtitle').title); //打字机
  }
  if(!loaded){
  loadExternalResource("https://jsdrp.vercel.app/npm/highlight.js@10/styles/github-gist.min.css","css"); //代码高亮
  loadExternalResource("https://jsdrp.vercel.app/npm/github-markdown-css@4.0.0/github-markdown.css","css"); //markdown
  // loadExternalResource("/css/main.css","css"); //主题主css
  $('link[href="/css/main.css"]').remove(); //移除主css标签，确保最后加载
  loadExternalResource("/css/main.css","css"); //重载主css
  loaded=true;
  }
  lazyload(window, document); //图片懒加载
  Fluid.events.registerScrollTopArrowEvent();
  Fluid.plugins.initTocBot();
  Fluid.plugins.initFancyBox(); 
  Fluid.plugins.initCopyCode();
  var modal = jQuery('#modalSearch');
  var searchSelector = '#local-search-input';
  var resultSelector = '#local-search-result';
  modal.on('show.bs.modal', function() {
    var path = CONFIG.search_path || '/local-search.xml';
    localSearchFunc(path, searchSelector, resultSelector);
  });
  modal.on('shown.bs.modal', function() {
    jQuery('#local-search-input').focus();
  });
  modal.on('hidden.bs.modal', function() {
    localSearchReset(searchSelector, resultSelector);
  });
  NProgress.done();
})
/*
pjax._handleResponse = pjax.handleResponse;
pjax.handleResponse = function(responseText, request, href, options) {
  //就简单过滤一下就行
  if((href.indexOf("%E6%9C%88")!=-1)||(href.indexOf("/live")!=-1)&&!init1){
      init1=true;//标记已经被加载
      Promise.all([
        //引入外部js 从fghrsh的live2d复制来的
        loadExternalResource("https://cdn.bootcss.com/dplayer/1.25.0/DPlayer.min.css", "css"),
        loadExternalResource("/ytyz2020/js/hls.min.js", "js"),
        loadExternalResource("https://cdn.bootcss.com/dplayer/1.25.0/DPlayer.min.js", "js")
      ]).then(() => {
        pjax._handleResponse(responseText, request, href, options);
      });
      //这里可以引入一些可以后加载的
      loadExternalResource("//jsdrp.vercel.app/npm/leancloud-realtime@5.0.0-rc.0/dist/realtime-browser.min.js", "js");
      loadExternalResource("//jsdrp.vercel.app/npm/leancloud-storage@4.3.1/dist/av-min.js", "js");
  }else{
      pjax._handleResponse(responseText, request, href, options);
  }
  //有播放器需要销毁 可以自己写点别的需要处理的东西
  if(typeof dplayers != "undefined") 
      for(i in dplayers)
      dplayers[i].destroy();
}*/
});
}
Fluid.boot = {};

Fluid.boot.registerEvents = function() {
  Fluid.events.billboard();
  Fluid.events.registerNavbarEvent();
  Fluid.events.registerParallaxEvent();
  Fluid.events.registerScrollDownArrowEvent();
  Fluid.events.registerScrollTopArrowEvent();
  Fluid.events.registerImageLoadedEvent();
};
pjax_init();
Fluid.boot.initPlugins = function() {
  CONFIG.anchorjs.enable && Fluid.plugins.initAnchor();
  CONFIG.toc.enable && Fluid.plugins.initTocBot();
  CONFIG.image_zoom.enable && Fluid.plugins.initFancyBox();
  CONFIG.copy_btn && Fluid.plugins.initCopyCode();
};

document.addEventListener('DOMContentLoaded', function() {
  Fluid.boot.registerEvents();
  Fluid.boot.initPlugins();
});
