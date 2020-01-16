const emailReg = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/

function $ajax(api, type = 'get', params = '', success = (res) => {}, error = () => {}) {
  // $.ajax({
  //   url: '/api' + api,
  //   type: type,
  //   datType: "JSON",
  //   contentType: "application/json",
  //   data: JSON.stringify(params),
  //   success: success,
  //   error: error
  // });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    type: type,
    success: success,
    error: error
  }
  if (type === 'post') {
    config.data = JSON.stringify(params)
  }
  mui.ajax('/syslinked_rest' + api, config)
}

function $upload(api, type = 'get', params = {}, success = (res) => {}, error = () => {}) {
  // $.ajax({
  //   url: '/api' + api,
  //   type: type,
  //   datType: "JSON",
  //   contentType: "application/json",
  //   data: JSON.stringify(params),
  //   success: success,
  //   error: error
  // });
  mui.ajax('/syslinked_rest' + api, {
    data: params,
    processData: false,
    contentType: false,
    type: type,
    success: success,
    error: error
  })
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function _get(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};


function datetime2Str(date) {
  if (date) {
    let years = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let mins = date.getMinutes()
    // let secds = date.getSeconds()
    let dateStr = [years, month, day].map(formatNumber).join('/')
    return dateStr + ' ' + [hours, mins].map(formatNumber).join(':')
  } else {
    return ''
  }
}

function iosTimeFormtter(date) {
  const day = date.substr(0, 10)
  const timeLength = date.indexOf('.')
  const time = date.substr(10, timeLength - 10)
  let hours = time.substr(1, 2)
  if (time.indexOf('T') !== -1) {
    hours = Number(hours) + 8
  }
  console.log(day + ' ' + hours)
  const timeStr = day + ' ' + hours + time.substr(3)
  return timeStr.replace(/-/g, '/')
}

function iosDateFormtter(date) {
  const day = date.substr(0, 10)
  const timeStr = day
  return timeStr.replace(/-/g, '/')
}

function time2Str(date) {
  if (date) {
    let hours = date.getHours()
    let mins = date.getMinutes()
    let secds = date.getSeconds()
    return [hours, mins, secds].map(formatNumber).join(':')
  } else {
    return ''
  }
}

function date2Str(date) {
  if (date) {
    const years = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [years, month, day].map(formatNumber).join('/')
  } else {
    return ''
  }
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function back() {
  self.location = document.referrer;
}

function call(params) {
  const callInfo = JSON.stringify(params)
  tianbai.getCall(callInfo)
}

function Callback(res) {
  alert('Callback')
  alert(res)
  return res
}

function alerCallBack() {
  alert('---------success')
}

function log(message, data) {
  const temp = message + ':<br/>' + JSON.stringify(data)
  document.getElementsByTagName('body')[0].append(temp)
  // var log = document.getElementById('log')
  // var el = document.createElement('div')
  // el.className = 'logLine'
  // el.innerHTML = message + ':<br/>' + JSON.stringify(data)
  // if (log.children.length) { log.insertBefore(el, log.children[0]) }
  // else { log.appendChild(el) }
}

const u = navigator.userAgent;
// Android终端
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
// IOS 终端
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
/**
 * Android  与安卓交互时：
 *      1、不调用这个函数安卓无法调用 H5 注册的事件函数；
 *      2、但是 H5 可以正常调用安卓注册的事件函数；
 *      3、还必须在 setupWebViewJavascriptBridge 中执行 bridge.init 方法，否则：
 *          ①、安卓依然无法调用 H5 注册的事件函数
 *          ①、H5 正常调用安卓事件函数后的回调函数无法正常执行
 *          
 * @param {*} callback 
 */
const andoirFunction = (callback) => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(window.WebViewJavascriptBridge);
    }, false)
  }
}

/**
 * IOS 与 IOS 交互时，使用这个函数即可，别的操作都不需要执行
 * @param {*} callback 
 */
const setupWebViewJavascriptBridge = (callback) => {
  // alert('iosFuntion')
  // alert(callback)
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
  // if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  // if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  // window.WVJBCallbacks = [callback];
  // var WVJBIframe = document.createElement('iframe');
  // WVJBIframe.style.display = 'none';
  // WVJBIframe.src = 'https://__bridge_loaded__';
  // document.documentElement.appendChild(WVJBIframe);
  // setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/**
 * 注册 setupWebViewJavascriptBridge 方法
 *  之所以不将上面两个方法融合成一个方法，是因为放在一起，那么就只有 iosFuntion 中相关的方法体生效
 */
window.setupWebViewJavascriptBridge = isAndroid ? andoirFunction : setupWebViewJavascriptBridge;

/**
 * 这里如果不做判断是不是安卓，而是直接就执行下面的方法，就会导致 
 *      1、IOS 无法调用 H5 这边注册的事件函数
 *      2、H5 可以正常调用 IOS 这边的事件函数，并且 H5 的回调函数可以正常执行
 */
if (isAndroid) {
  /**
   * 与安卓交互时，不调用这个函数会导致：
   *      1、H5 可以正常调用 安卓这边的事件函数，但是无法再调用到 H5 的回调函数
   * 
   * 前提 setupWebViewJavascriptBridge 这个函数使用的是 andoirFunction 这个，否则还是会导致上面 1 的现象出现
   */
  window.setupWebViewJavascriptBridge(function (bridge) {
    // 注册 H5 界面的默认接收函数（与安卓交互时，不注册这个事件无法接收回调函数）
    bridge.init(function (msg, responseCallback) {
      // message.success(msg);
      responseCallback("JS 返回给原生的消息内容");
    })
  })


} else {
  // alert('----ios')
  window.setupWebViewJavascriptBridge(function (bridge) {
    // bridge.registerHandler('changeData', function (data, responseCallback) {
    //   log('ObjC called testJavascriptHandler with', data)
    //   var responseData = { 'Javascript Says': 'Right back atcha!' }
    //   log('JS responding with', responseData)
    //   responseCallback(responseData)
    // })
    bridge.registerHandler('changeData', function (data, responseCallback) {
      var responseData = {
        'Javascript Says': 'Right back atcha!'
      }
      log('JS responding with', responseData)
      // alert(responseData)
      responseCallback(responseData)
    })

    // bridge.callHandler('changeData', { 'foo': 'bar' }, function (response) {
    //   log('JS got response1', response)
    //   // alert(response)
    // })
  })
}


// function getCall (funName, params, resultFun = () => { }) {
//   window.setupWebViewJavascriptBridge(bridge => {
//     bridge.callHandler(funName, JSON.stringify(params), (result) => {
//       // alert(result)
//       // log('JS got response12', response)
//       resultFun(result)
//     })
//   })
// }

// function call (funName, params, resultFun = () => { }) {
//   window.setupWebViewJavascriptBridge(bridge => {
//     bridge.callHandler(funName, JSON.stringify(params), (result) => {
//       // alert(result)
//       // log('JS got response12', response)
//       resultFun(result)
//     })
//   })
// }

const imgPath = 'https://alieneye.s3.cn-northwest-1.amazonaws.com.cn/'

// function sidebar () {
//   const project = JSON.parse(localStorage.getItem('project'))
//   console.log('project', project)
//   const temp = `<div class="sidebar-box"></div>
//         <div class="sidebar">
//           <div class="author">
//             <div class="linear-gradient-bg"></div>
//             <img src="${imgPath}${project.pic}" width="100%" height="100%">
//             <div class="author-content padding text-white">
//               <div class="text-right"><i class="icon iconfont iconicon-test29
//                   ft-23"></i></div>
//               <div class="author-img"><img src="${imgPath}${project.pic}"></div>
//               <div class="mt-05 ft-16">${project.name}</div>
//               <div class="ft-14">SHJIXM09794</div>
//             </div>
//           </div>
//           <div class="sidebar-menu pt-10 pb-10 ft-16 text-grey">
//             <ul>
//               <li class="flex menu-list" id="allPictures" data-menu='All pictures'>
//                 <i class="icon iconfont iconicon-test"></i>
//                 <span class="pl-05">All pictures</span>
//               </li>
//               <li class="flex menu-list" id="floorPlan" data-menu='Floor plan'>
//                 <i class="icon iconfont iconicon-test14"></i>
//                 <span class="pl-05">Floor plan</span>
//               </li>
//               <li class="flex menu-list" data-url="/file/" id="file">
//                 <i class="icon iconfont iconicon-test15"></i>
//                 <span class="pl-05">File</span>
//               </li>
//               <li class="flex menu-list" id="cameraManagement" data-menu='Camera management'>
//                 <i class="icon iconfont iconicon-test16"></i>
//                 <span class="pl-05">Camera management</span>
//               </li>
//               <li class="flex menu-list"  data-url="/projectMember/projectMembers.html" id="teamStaff">
//                 <i class="icon iconfont iconicon-test4"></i>
//                 <span class="pl-05">Team Staff</span>
//               </li>
//               <li class="flex menu-list" data-url="/invoice/" id="cost">
//                 <i class="icon iconfont iconicon-test17"></i>
//                 <span class="pl-05">cost</span>
//               </li>
//               <li class="flex menu-list" data-url="/recycle/" id="recycleBin">
//                 <i class="icon iconfont iconicon-test9"></i>
//                 <span class="pl-05">Recycle Bin</span>
//               </li>              
//             </ul>
//           </div>
//           <div class="sidebar-footer flex ft-16 padding" data-url="/">
//             <i class="icon iconfont iconicon-test1"></i>
//             <span class="pl-05">Back to Home</span>
//           </div>`
//   // document.getElementsByName()
//   $('body').append(temp)
// }
// sidebar()
mui('body').on('tap', '#sidebar', function () {
  window.setupWebViewJavascriptBridge(bridge => {
    bridge.callHandler('jumpPage', 'leftCornerClick')
  })
  // $('.sidebar-box, .sidebar').addClass('active')
})
// mui('body').on('tap', '.sidebar-box', function () {
//   if (location.pathname !== '/menu.html') {
//     $('.sidebar-box, .sidebar').removeClass('active')
//   }
// })

// mui('.sidebar').on('tap', '.menu-list, .sidebar-footer', function () {
//   console.log(this)
//   const url = this.getAttribute('data-url')
//   const menu = this.getAttribute('data-menu')
//   if (url) {
//     mui.openWindow({
//       url: url,
//       id: this.innerText
//     })
//   } else if (menu) {
//     window.setupWebViewJavascriptBridge(bridge => {
//       bridge.callHandler('jumpPage', menu)
//     })
//   }
// })

function activeSidebar(menu) {
  // $(`#${menu}`).addClass('active')
  console.log(menu)
}


function loadingShow() {
  const temp = `<div class="loading" id="loading">
    <div class="icon iconfont iconloading1"></div>
    </div>`
  $('body').append(temp)
}

function loadingHide() {
  $('#loading').remove()
}

function muiInit(container, pulldownRefresh = () => {}) {
  return {
    pullRefresh: {
      container: container, //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,
        style: 'circle',
        contentdown: "Pull down to refresh", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "Refresh immediately", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "loading", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: pulldownRefresh
      }
    }
  }
}

function openFile(url) {
  //创建一个下载任务
  var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
    if (status == 200) {
      var fileUrl = d.filename;
      plus.runtime.openFile(fileUrl, {}, function (e) {
        alert('打开失败');
      });
    } else {
      alert("Download failed: " + status);
    }
  });
  dtask.start();
}
// const pullDownRefresh = {
//   pullRefresh: {
//     container: "#pullrefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//     down: {
//       auto: true,
//       style: 'circle',
//       callback: pulldownRefresh
//     }
//   }
// }