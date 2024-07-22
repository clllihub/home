// 为滑块添加注释和改善变量命名
const cols = 3; // 定义列数
const main = document.getElementById('main'); // 获取主容器
let parts = []; // 存储部分的数组

// 图片和视频数组
let media = [
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/1.jpg"},
  {type: 'video', src: "https://ossoososssn.oss-cn-beijing.aliyuncs.com/video/bg.mov"},
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/5.jpg"},
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/7.jpg"}
];
let current = 0; // 当前显示的媒体索引
let playing = false; // 动画是否正在播放的标志

// 预加载所有图片和视频
for (let i in media) {
  if (media[i].type === 'img') {
    new Image().src = media[i].src;
  }
}

// 创建列的部分
for (let col = 0; col < cols; col++) {
  let part = document.createElement('div'); // 创建一个新的div元素
  part.className = 'part'; // 为div添加类名
  let el = document.createElement('div'); // 创建一个新的div元素
  el.className = 'section'; // 为div添加类名

  // 创建并设置第一个媒体元素（图片或视频）
  let mediaElement = document.createElement(media[current].type); // 根据类型创建元素
  mediaElement.src = media[current].src; // 设置源
  if (media[current].type === 'video') {
    mediaElement.autoplay = true; // 自动播放
    mediaElement.loop = true; // 循环播放
    mediaElement.muted = true; // 静音播放
  }
  el.appendChild(mediaElement); // 将媒体元素添加到section
  part.style.setProperty('--x', -100/cols*col+'vw');
  part.appendChild(el); // 将section添加到part
  main.appendChild(part); // 将part添加到main
  parts.push(part); // 将part添加到parts数组
}

// 动画选项
let animOptions = {
  duration: 2.3,
  ease: Power4.easeInOut // 动画缓动效果
};

// 切换媒体函数
function go(dir) {
  if (!playing) {
    playing = true; // 设置动画正在播放的标志
    if (current + dir < 0) current = media.length - 1;
    else if (current + dir >= media.length) current = 0;
    else current += dir;

    // 向上滚动动画
    function up(part, next) {
      part.appendChild(next);
      gsap.to(part, {...animOptions, y: -window.innerHeight}).then(function () {
        part.children[0].remove();
        gsap.to(part, {duration: 0, y: 0});
      });
    }

    // 向下滚动动画
    function down(part, next) {
      part.prepend(next);
      gsap.to(part, {duration: 0, y: -window.innerHeight});
      gsap.to(part, {...animOptions, y: 0}).then(function () {
        part.children[1].remove();
        playing = false;
      });
    }

    // 为每个部分添加动画
    for (let p in parts) {
      let part = parts[p];
      let next = document.createElement('div');
      next.className = 'section';
      let nextMedia = document.createElement(media[current].type);
      nextMedia.src = media[current].src;
      if (media[current].type === 'video') {
        nextMedia.autoplay = true;
        nextMedia.loop = true;
        nextMedia.muted = true;
      }
      next.appendChild(nextMedia);

      if ((p - Math.max(0, dir)) % 2) {
        down(part, next);
      } else {
        up(part, next);
      }
    }
  }
}

// 键盘事件监听器
window.addEventListener('keydown', function(e) {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    go(1);
  } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    go(-1);
  }
});

// 线性插值函数
function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}

const cursor = document.createElement('div');
cursor.className = 'cursor';

const cursorF = document.createElement('div');
cursorF.className = 'cursor-f';
let cursorX = 0;
let cursorY = 0;
let pageX = 0;
let pageY = 0;
let size = 8;
let sizeF = 36;
let followSpeed = .16;

document.body.appendChild(cursor);
document.body.appendChild(cursorF);

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorF.style.display = 'none';
}

cursor.style.setProperty('--size', size + 'px');
cursorF.style.setProperty('--size', sizeF + 'px');

window.addEventListener('mousemove', function(e) {
  pageX = e.clientX;
  pageY = e.clientY;
  cursor.style.left = e.clientX - size / 2 + 'px';
  cursor.style.top = e.clientY - size / 2 + 'px';
});

function loop() {
  cursorX = lerp(cursorX, pageX, followSpeed);
  cursorY = lerp(cursorY, pageY, followSpeed);
  cursorF.style.top = cursorY - sizeF / 2 + 'px';
  cursorF.style.left = cursorX - sizeF / 2 + 'px';
  requestAnimationFrame(loop);
}

loop();

let startY;
let endY;
let clicked = false;

function mousedown(e) {
  gsap.to(cursor, {scale: 4.5});
  gsap.to(cursorF, {scale: .4});
  clicked = true;
  startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}

function mouseup(e) {
  gsap.to(cursor, {scale: 1});
  gsap.to(cursorF, {scale: 1});
  endY = e.clientY || endY;
  if (clicked && startY && Math.abs(startY - endY) >= 40) {
    go(!Math.min(0, startY - endY) ? 1 : -1);
    clicked = false;
    startY = null;
    endY = null;
  }
}

window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
window.addEventListener('touchmove', function(e) {
  if (clicked) {
    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }
}, false);
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

let scrollTimeout;

function wheel(e) {
  clearTimeout(scrollTimeout);
  setTimeout(function() {
    if (e.deltaY < -40) {
      go(-1);
    } else if (e.deltaY >= 40) {
      go(1);
    }
  });
}

window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);
