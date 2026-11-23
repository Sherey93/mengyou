import './global.css';

/** 前情三段，打字机逐字铺开；点击正文可跳过 */
const 段落 = [
  '市区十二楼，四居室。主卧和你的房间背背相邻，两张床的床头贴着同一堵墙。',
  '徐琦四十岁，内科病区护士，班倒着上，睡眠被切成一截一截。你父亲每晚都回来，回来就进主卧。',
  '这个家不吵架，只有很轻的电视声和很清楚的碗筷声。然后，是你的门被推开。',
];

const 字间隔 = 32;
const 段间隔 = 380;

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
  跑打字机();
  const 按钮 = document.getElementById('enterBtn') as HTMLButtonElement | null;
  按钮?.addEventListener('click', () => 翻到开场白(按钮));
}

$(() => {
  errorCatched(init)();
});
