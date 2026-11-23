import './global.css';
import 护士一 from './护士一.webp?url';
import 护士二 from './护士二.webp?url';

/** 前情，打字机逐字铺开；点击正文可跳过 */
const 段落 = [
  '主卧与你的房间背背相邻，两张床的床头贴着同一堵墙。',
  '四十岁的徐琦，白天是冷静克制的内科护士，夜里却被倒班切碎了睡眠，也被这段没有温度的婚姻冷落了太久。',
  '每当深夜客厅熄灯、隔壁主卧响起你父亲均匀的鼾声，你房间的门把手就会轻轻转动。',
  '她光着脚、穿着松软的棉质睡衣走进来，掀开你的被子，带着沐浴露与淡淡的体温，毫无防备地贴进你怀里。',
  '起初，她只是在梦游中本能地寻找暖意；可后来，当你的呼吸越来越烫，她那双紧闭的眼睫微微颤动时，她究竟是还没醒，还是早已清醒着，把这场越界演成了默许？',
];

const 字间隔 = 26;
const 段间隔 = 340;

/** 把第一楼消息翻到开场白那一页 */
async function 翻到开场白(按钮: HTMLButtonElement) {
  按钮.disabled = true;
  try {
    const 消息 = await getChatMessages(0, { include_swipes: true });
    const 第一楼 = 消息 && 消息[0];
    if (!第一楼) {
      throw new Error('没有找到第一楼消息');
    }
    const 页数 = (第一楼.swipes && 第一楼.swipes.length) || 1;
    console.info('欢迎页：可用开场白页数', 页数);
    if (页数 < 2) {
      throw new Error('没有第二个开场白，无法翻页');
    }
    await setChatMessages([{ message_id: 0, swipe_id: 1 }], { refresh: 'all' });
  } catch (错误) {
    console.error('欢迎页翻页失败', 错误);
    按钮.disabled = false;
  }
}

function 跑打字机() {
  const 容器 = document.getElementById('typewriter');
  const 跳过提示 = document.getElementById('skipHint');
  const 故事区 = document.getElementById('storyArea');
  if (!容器) {
    return;
  }

  let 段序 = 0;
  let 字序 = 0;
  let 当前段: HTMLParagraphElement | null = null;
  let 计时: number | undefined;
  let 完成 = false;

  跳过提示?.classList.add('show');
  setTimeout(() => 跳过提示?.classList.add('show'), 600);

  const 建当前段 = () => {
    当前段 = document.createElement('p');
    const 光标 = document.createElement('span');
    光标.className = 'cursor';
    当前段.appendChild(光标);
    容器.appendChild(当前段);
    return 光标;
  };

  let 光标 = 建当前段();

  const 收尾 = () => {
    容器.textContent = '';
    for (const 一句 of 段落) {
      const 段 = document.createElement('p');
      段.textContent = 一句;
      容器.appendChild(段);
    }
    跳过提示?.classList.remove('show');
    完成 = true;
  };

  const 下一步 = () => {
    if (完成) {
      return;
    }
    if (段序 >= 段落.length) {
      收尾();
      return;
    }
    const 目标 = 段落[段序];
    if (字序 < 目标.length) {
      光标.insertAdjacentText('beforebegin', 目标[字序]);
      字序 += 1;
      计时 = window.setTimeout(下一步, 字间隔);
      return;
    }
    段序 += 1;
    字序 = 0;
    if (段序 < 段落.length) {
      光标 = 建当前段();
      计时 = window.setTimeout(下一步, 段间隔);
      return;
    }
    收尾();
  };

  故事区?.addEventListener('click', () => {
    if (完成) {
      return;
    }
    if (计时) {
      clearTimeout(计时);
    }
    收尾();
  });

  下一步();
}

function init() {
  document.documentElement.style.setProperty('--welcome-img-left', `url("${护士一}")`);
  document.documentElement.style.setProperty('--welcome-img-right', `url("${护士二}")`);
  跑打字机();
  const 按钮 = document.getElementById('enterBtn') as HTMLButtonElement | null;
  按钮?.addEventListener('click', () => 翻到开场白(按钮));
}

$(() => {
  errorCatched(init)();
});
