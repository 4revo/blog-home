/*
作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

//弹窗样式
iziToast.settings({
    timeout: 10000,
    progressBar: false,
    close: false,
    closeOnEscape: true,
    position: 'topCenter',
    transitionIn: 'bounceInDown',
    transitionOut: 'flipOutX',
    displayMode: 'replace',
    layout: '1',
    backgroundColor: '#00000040',
    titleColor: '#efefef',
    messageColor: '#efefef',
    icon: 'Fontawesome',
    iconColor: '#efefef',
});

/* 鼠标样式 */
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
    element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${y - halfAlementWidth2 + 1}px)`;
}

body.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(function () {
        setPosition(e.clientX, e.clientY);
    });
});



//加载完成后执行
window.addEventListener('load', function () {

    //载入动画
    $('#loading-box').attr('class', 'loaded');
    $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
    $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
    $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");

    //用户欢迎
    setTimeout(function () {
        iziToast.show({
            timeout: 2500,
            icon: false,
            title: hello,
            message: '欢迎来到我的主页'
        });
    }, 800);

    //延迟加载音乐播放器
    let element = document.createElement("script");
    element.src = "./js/music.js";
    document.body.appendChild(element);

    //中文字体缓加载-此处写入字体源文件 （暂时弃用）
    //先行加载简体中文子集，后续补全字集
    //由于压缩过后的中文字体仍旧过大，可转移至对象存储或 CDN 加载
    // const font = new FontFace(
    //     "MiSans",
    //     "url(" + "./font/MiSans-Regular.woff2" + ")"
    // );
    // document.fonts.add(font);

    //移动端去除鼠标样式
    if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
        $('#g-pointer-2').css("display", "none");
    }

}, false)

setTimeout(function () {
    $('#loading-text').html("字体及文件加载可能需要一定时间")
}, 3000);

// 新春灯笼 （ 需要时可取消注释 ）
// new_element=document.createElement("link");
// new_element.setAttribute("rel","stylesheet");
// new_element.setAttribute("type","text/css");
// new_element.setAttribute("href","./css/lantern.css");
// document.body.appendChild(new_element);

// new_element=document.createElement("script");
// new_element.setAttribute("type","text/javascript");
// new_element.setAttribute("src","./js/lantern.js");
// document.body.appendChild(new_element);

//获取一言
fetch('https://v1.hitokoto.cn?max_length=24')
    .then(response => response.json())
    .then(data => {
        $('#hitokoto_text').html(data.hitokoto)
        $('#from_text').html(data.from)
    })
    .catch(console.error)

let times = 0;
$('#hitokoto').click(function () {
    if (times == 0) {
        times = 1;
        let index = setInterval(function () {
            times--;
            if (times == 0) {
                clearInterval(index);
            }
        }, 1000);
        fetch('https://v1.hitokoto.cn?max_length=24')
            .then(response => response.json())
            .then(data => {
                $('#hitokoto_text').html(data.hitokoto)
                $('#from_text').html(data.from)
            })
            .catch(console.error)
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: '你点太快了吧'
        });
    }
});

//获取天气
//定位：优先浏览器精确经纬度，失败则回退到 IP 定位
//天气：Open-Meteo（免 API Key，实时数据）
const WMO_TEXT = {
    0: "晴", 1: "晴间多云", 2: "多云", 3: "阴",
    45: "雾", 48: "雾凇",
    51: "毛毛雨", 53: "毛毛雨", 55: "毛毛雨",
    56: "冻毛毛雨", 57: "冻毛毛雨",
    61: "小雨", 63: "中雨", 65: "大雨",
    66: "冻雨", 67: "冻雨",
    71: "小雪", 73: "中雪", 75: "大雪", 77: "雪粒",
    80: "阵雨", 81: "阵雨", 82: "强阵雨",
    85: "阵雪", 86: "阵雪",
    95: "雷阵雨", 96: "雷阵雨伴冰雹", 99: "雷阵雨伴冰雹"
};
function wmoToText(code) {
    return WMO_TEXT[code] || "未知";
}
function degToDir(deg) {
    if (deg === null || deg === undefined || isNaN(deg)) return "";
    const dirs = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
    return dirs[Math.round(deg / 45) % 8];
}
// 米/秒 转 风力等级
function msToScale(ms) {
    const t = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];
    let s = 0;
    while (s < t.length && ms >= t[s]) s++;
    return s;
}
// 浏览器精确位置
function getBrowserPosition() {
    return new Promise(function (resolve, reject) {
        if (!navigator.geolocation) return reject(new Error("no geolocation"));
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            },
            function (err) { reject(err); },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    });
}
// IP 定位兜底（含城市名）
function getIpPosition() {
    return fetch("https://ipwho.is/")
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (d && d.success !== false && d.latitude) {
                return { lat: d.latitude, lon: d.longitude, city: d.city };
            }
            return fetch("https://ipapi.co/json/")
                .then(function (r) { return r.json(); })
                .then(function (b) {
                    if (b && b.latitude) {
                        return { lat: b.latitude, lon: b.longitude, city: b.city };
                    }
                    throw new Error("ip locate failed");
                });
        });
}
function getWeather() {
    $('#city_text').html("定位中");
    $('#wea_text').html("...");
    $('#tem_text').html("");
    $('#win_text').html("");
    $('#win_speed').html("");
    (async function () {
        let pos;
        try {
            pos = await getBrowserPosition();
        } catch (e) {
            pos = await getIpPosition();
        }
        $('#city_text').html(pos.city || "当前位置");
        let url = "https://api.open-meteo.com/v1/forecast?latitude=" + pos.lat +
            "&longitude=" + pos.lon +
            "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m" +
            "&wind_speed_unit=ms&timezone=auto";
        let res = await fetch(url);
        let data = await res.json();
        let cur = data.current;
        $('#wea_text').html(wmoToText(cur.weather_code));
        $('#tem_text').html(cur.temperature_2m + "°C&nbsp;");
        $('#win_text').html(degToDir(cur.wind_direction_10m));
        $('#win_speed').html(msToScale(cur.wind_speed_10m) + "级");
    })().catch(function (err) {
        console.error(err);
        $('#city_text').html("天气");
        $('#wea_text').html("加载失败");
        $('#tem_text').html("");
        $('#win_text').html("");
        $('#win_speed').html("");
    });
}

getWeather();

let wea = 0;
$('#upWeather').click(function () {
    if (wea == 0) {
        wea = 1;
        let index = setInterval(function () {
            wea--;
            if (wea == 0) {
                clearInterval(index);
            }
        }, 60000);
        getWeather();
        iziToast.show({
            timeout: 2000,
            icon: "fa-solid fa-cloud-sun",
            message: '实时天气已更新'
        });
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: '请稍后再更新哦'
        });
    }
});

//获取时间
let t = null;
t = setTimeout(time, 1000);

function time() {
    clearTimeout(t);
    dt = new Date();
    let y = dt.getYear() + 1900;
    let mm = dt.getMonth() + 1;
    let d = dt.getDate();
    let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let day = dt.getDay();
    let h = dt.getHours();
    let m = dt.getMinutes();
    let s = dt.getSeconds();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    $("#time").html(y + "&nbsp;年&nbsp;" + mm + "&nbsp;月&nbsp;" + d + "&nbsp;日&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
    t = setTimeout(time, 1000);
}

//链接提示文字
$("#social").mouseover(function () {
    $("#social").css({
        "background": "rgb(0 0 0 / 25%)",
        'border-radius': '6px',
        "backdrop-filter": "blur(5px)"
    });
    $("#link-text").css({
        "display": "block",
    });
}).mouseout(function () {
    $("#social").css({
        "background": "none",
        "border-radius": "6px",
        "backdrop-filter": "none"
    });
    $("#link-text").css({
        "display": "none"
    });
});

$("#github").mouseover(function () {
    $("#link-text").html("去 Github 看看");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#qq").mouseover(function () {
    $("#link-text").html("有什么事吗");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#email").mouseover(function () {
    $("#link-text").html("来封 Email");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#bilibili").mouseover(function () {
    $("#link-text").html("来 B 站看看 ~");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#telegram").mouseover(function () {
    $("#link-text").html("你懂的 ~");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});

//自动变灰
let myDate = new Date;
let mon = myDate.getMonth() + 1;
let date = myDate.getDate();
let days = ['4.4', '5.12', '7.7', '9.9', '9.18', '12.13'];
for (let day of days) {
    let d = day.split('.');
    if (mon == d[0] && date == d[1]) {
        document.write(
            '<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>'
        );
        $("#change").html("Silence&nbsp;in&nbsp;silence");
        $("#change1").html("今天是中国国家纪念日，全站已切换为黑白模式");
        window.addEventListener('load', function () {
            setTimeout(function () {
                iziToast.show({
                    timeout: 14000,
                    icon: "fa-solid fa-clock",
                    message: '今天是中国国家纪念日'
                });
            }, 3800);
        }, false);
    }
}

//更多页面切换
let shoemore = false;
$('#switchmore').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");
    }
});

//更多页面关闭按钮
$('#close').on('click', function () {
    $('#switchmore').click();
});

//移动端菜单栏切换
let switchmenu = false;
$('#switchmenu').on('click', function () {
    switchmenu = !switchmenu;
    if (switchmenu) {
        $('#row').attr('class', 'row menus');
        $("#menu").html("<i class='fa-solid fa-xmark'></i>");
    } else {
        $('#row').attr('class', 'row');
        $("#menu").html("<i class='fa-solid fa-bars'></i>");
    }
});

//更多弹窗页面
$('#openmore').on('click', function () {
    $('#box').css("display", "block");
    $('#row').css("display", "none");
    $('#more').css("cssText", "display:none !important");
});
$('#closemore').on('click', function () {
    $('#box').css("display", "none");
    $('#row').css("display", "flex");
    $('#more').css("display", "flex");
});

//监听网页宽度
window.addEventListener('load', function () {
    window.addEventListener('resize', function () {
        //关闭移动端样式
        if (window.innerWidth >= 600) {
            $('#row').attr('class', 'row');
            $("#menu").html("<i class='fa-solid fa-bars'></i>");
            //移除移动端切换功能区
            $('#rightone').attr('class', 'row rightone');
        }

        if (window.innerWidth <= 990) {
            //移动端隐藏更多页面
            $('#container').attr('class', 'container');
            $("#change").html("Hello&nbsp;World&nbsp;!");
            $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");

            //移动端隐藏弹窗页面
            $('#box').css("display", "none");
            $('#row').css("display", "flex");
            $('#more').css("display", "flex");
        }
    })
})

//移动端切换功能区
let changemore = false;
$('#changemore').on('click', function () {
    changemore = !changemore;
    if (changemore) {
        $('#rightone').attr('class', 'row menus mobile');
    } else {
        $('#rightone').attr('class', 'row menus');
    }
});

//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
}, function () {
    $('#close').css("display", "none");
})

//屏蔽右键
document.oncontextmenu = function () {
    iziToast.show({
        timeout: 2000,
        icon: "fa-solid fa-circle-exclamation",
        message: '为了浏览体验，本站禁用右键'
    });
    return false;
}

//控制台输出
//console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
let styleTitle2 = `
font-size:12px;
color: #425AEF;
`
let styleContent = `
color: rgb(30,152,255);
`
let title1 = 'Auroraの主页'
let title2 = `

██████╗ ██╗   ██╗██╗    ██╗██╗███╗   ██╗██████╗ 
██╔══██╗╚██╗ ██╔╝██║    ██║██║████╗  ██║██╔══██╗
██████╔╝ ╚████╔╝ ██║ █╗ ██║██║██╔██╗ ██║██║  ██║
██╔══██╗  ╚██╔╝  ██║███╗██║██║██║╚██╗██║██║  ██║
██████╔╝   ██║   ╚███╔███╔╝██║██║ ╚████║██████╔╝
╚═════╝    ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝               
`
let content = `
博客:  https://bolo.wuhobin.top
Github:  https://github.com/wuhobin
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)
