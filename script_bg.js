const columnsCount = 3; // 定义列数
const mainContainer = document.getElementById('main'); // 获取主容器
let partsArray = []; // 存储部分的数组

// 图片和视频数组
let mediaArray = [
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/1.jpg"},
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/5.jpg"},
  {type: 'img', src: "https://cllli.oss-cn-beijing.aliyuncs.com/background/7.jpg"},
  {type: 'video', src: "https://ossoososssn.oss-cn-beijing.aliyuncs.com/video/bg.mp4"}
];
let currentMediaIndex = 0; // 当前显示的媒体索引
let isPlaying = false; // 动画是否正在播放的标志

// 预加载所有图片和视频
mediaArray.forEach((media) => {
  if (media.type === 'img') {
    new Image().src = media.src;
  } else if (media.type === 'video') {
    let video = document.createElement('video');
    video.src = media.src;
    video.preload = 'auto';
  }
});

// 创建列的部分
for (let col = 0; col < columnsCount; col++) {
  let part = document.createElement('div'); // 创建一个新的div元素
  part.className = 'part'; // 为div添加类名
  let section = document.createElement('div'); // 创建一个新的div元素
  section.className = 'section'; // 为div添加类名

  // 创建并设置第一个媒体元素（图片或视频）
  let mediaElement = document.createElement(mediaArray[currentMediaIndex].type); // 根据类型创建元素
  mediaElement.src = mediaArray[currentMediaIndex].src; // 设置源
  if (mediaArray[currentMediaIndex].type === 'video') {
    mediaElement.autoplay = true; // 自动播放
    mediaElement.loop = true; // 循环播放
    mediaElement.muted = true; // 静音播放
  }
  section.appendChild(mediaElement); // 将媒体元素添加到section
  part.style.setProperty('--x', -100 / columnsCount * col + 'vw');
  part.appendChild(section); // 将section添加到part
  mainContainer.appendChild(part); // 将part添加到main
  partsArray.push(part); // 将part添加到parts数组
}

// 动画选项
let animationOptions = {
  duration: 2.3,
  ease: Power4.easeInOut // 动画缓动效果
};

// 切换媒体函数
function switchMedia(direction) {
  if (!isPlaying) {
    isPlaying = true; // 设置动画正在播放的标志
    if (currentMediaIndex + direction < 0) currentMediaIndex = mediaArray.length - 1;
    else if (currentMediaIndex + direction >= mediaArray.length) currentMediaIndex = 0;
    else currentMediaIndex += direction;

    // 向上滚动动画
    function scrollUp(part, next) {
      part.appendChild(next);
      gsap.to(part, {...animationOptions, y: -window.innerHeight}).then(function () {
        part.children[0].remove();
        gsap.to(part, {duration: 0, y: 0});
      });
    }

    // 向下滚动动画
    function scrollDown(part, next) {
      part.prepend(next);
      gsap.to(part, {duration: 0, y: -window.innerHeight});
      gsap.to(part, {...animationOptions, y: 0}).then(function () {
        part.children[1].remove();
        isPlaying = false;
      });
    }

    // 为每个部分添加动画
    partsArray.forEach((part, index) => {
      let nextSection = document.createElement('div');
      nextSection.className = 'section';
      let nextMediaElement = document.createElement(mediaArray[currentMediaIndex].type);
      nextMediaElement.src = mediaArray[currentMediaIndex].src;
      if (mediaArray[currentMediaIndex].type === 'video') {
        nextMediaElement.autoplay = true;
        nextMediaElement.loop = true;
        nextMediaElement.muted = true;
      }
      nextSection.appendChild(nextMediaElement);

      if ((index - Math.max(0, direction)) % 2) {
        scrollDown(part, nextSection);
      } else {
        scrollUp(part, nextSection);
      }
    });
  }
}

// 键盘事件监听器
window.addEventListener('keydown', function(e) {
  resetInactivityTimer();
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    switchMedia(1);
  } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    switchMedia(-1);
  }
});

// 线性插值函数
function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}

const cursor = document.createElement('div');
cursor.className = 'cursor';

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;
let cursorSize = 8;
let followerSize = 36;
let followSpeed = 0.16;

document.body.appendChild(cursor);
document.body.appendChild(cursorFollower);

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorFollower.style.display = 'none';
}

cursor.style.setProperty('--size', cursorSize + 'px');
cursorFollower.style.setProperty('--size', followerSize + 'px');

window.addEventListener('mousemove', function(e) {
  resetInactivityTimer();
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = e.clientX - cursorSize / 2 + 'px';
  cursor.style.top = e.clientY - cursorSize / 2 + 'px';
});

function loop() {
  cursorX = lerp(cursorX, mouseX, followSpeed);
  cursorY = lerp(cursorY, mouseY, followSpeed);
  cursorFollower.style.top = cursorY - followerSize / 2 + 'px';
  cursorFollower.style.left = cursorX - followerSize / 2 + 'px';
  requestAnimationFrame(loop);
}

loop();

let startY;
let endY;
let isClicked = false;

function onMouseDown(e) {
  resetInactivityTimer();
  gsap.to(cursor, {scale: 4.5});
  gsap.to(cursorFollower, {scale: 0.4});
  isClicked = true;
  startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}

function onMouseUp(e) {
  resetInactivityTimer();
  gsap.to(cursor, {scale: 1});
  gsap.to(cursorFollower, {scale: 1});
  endY = e.clientY || endY;
  if (isClicked && startY && Math.abs(startY - endY) >= 40) {
    switchMedia(!Math.min(0, startY - endY) ? 1 : -1);
    isClicked = false;
    startY = null;
    endY = null;
  }
}

window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('touchstart', onMouseDown, false);
window.addEventListener('touchmove', function(e) {
  if (isClicked) {
    resetInactivityTimer();
    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }
}, false);
window.addEventListener('touchend', onMouseUp, false);
window.addEventListener('mouseup', onMouseUp, false);

let scrollTimeout;

function onScroll(e) {
  resetInactivityTimer();
  clearTimeout(scrollTimeout);
  setTimeout(function() {
    if (e.deltaY < -40) {
      switchMedia(-1);
    } else if (e.deltaY >= 40) {
      switchMedia(1);
    }
  });
}

window.addEventListener('mousewheel', onScroll, false);
window.addEventListener('wheel', onScroll, false);

// 设置自动播放视频的计时器
let inactivityTimeout;

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(function() {
    let videoIndex = mediaArray.findIndex(media => media.type === 'video');
    if (videoIndex !== -1) {
      currentMediaIndex = videoIndex;
      switchMedia(0);
    }
  }, 10000); // 15秒后自动播放视频
}

// 初始化时重置计时器
resetInactivityTimer();
