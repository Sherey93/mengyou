<template>
  <section class="status" role="status" aria-live="polite">
    <NightHeader
      :clock="世界.时刻"
      :weekday="世界.星期"
      :scene="世界.场景"
      :father-label="父亲文案"
      :father-level="父亲等级"
      :suspicion="世界.父亲.怀疑度"
    />

    <div class="stage">
      <span class="stage-name">{{ 徐琦.阶段 }}</span>
      <span class="stage-scale" :aria-label="`阶段进度 ${当前阶段序 + 1} / 4`">
        <i v-for="(各段, 序) in 阶段序" :key="各段" class="stage-seg" :class="{ on: 序 <= 当前阶段序 }"></i>
      </span>
    </div>

    <MeterBar label="积压" :value="徐琦.积压值" tone="heat" note="她没被满足的那部分，越涨越藏不住" />
    <MeterBar label="沉沦" :value="徐琦.沉沦度" tone="sink" note="她在多大程度上认了这件事" />
    <MeterBar label="感情" :value="徐琦.感情深度" tone="attach" note="非性的那部分，只有性不涨" />

    <BodyState
      :sleep="徐琦.身体状态.睡眠"
      :in-bed="徐琦.是否在床"
      :pajamas="徐琦.身体状态.睡衣"
      :blanket="徐琦.身体状态.被子"
    />

    <p v-if="徐琦.心情" class="mood">{{ 徐琦.心情 }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';
import NightHeader from './components/NightHeader.vue';
import MeterBar from './components/MeterBar.vue';
import BodyState from './components/BodyState.vue';

const store = useDataStore();

const 世界 = computed(() => store.data.世界);
const 徐琦 = computed(() => store.data.徐琦);

const 阶段序 = ['真梦游', '装睡', '假装梦游', '摊牌'] as const;
const 当前阶段序 = computed(() => {
  const 序 = 阶段序.indexOf(徐琦.value.阶段);
  return 序 < 0 ? 0 : 序;
});

const 父亲文案表: Record<string, string> = {
  在主卧熟睡: '隔壁睡着',
  在主卧醒着: '隔壁醒着',
  起夜中: '他起来了',
  在客厅: '他在客厅',
  应酬未归: '还没回',
};

const 父亲等级表: Record<string, 'calm' | 'alert' | 'muted'> = {
  在主卧熟睡: 'calm',
  在主卧醒着: 'alert',
  起夜中: 'alert',
  在客厅: 'alert',
  应酬未归: 'muted',
};

const 父亲文案 = computed(() => 父亲文案表[世界.value.父亲.状态] ?? 世界.value.父亲.状态);
const 父亲等级 = computed(() => 父亲等级表[世界.value.父亲.状态] ?? 'muted');
</script>

<style scoped>
.status {
  margin: 10px 0;
  padding: 12px 14px 13px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  background:
    radial-gradient(120% 150% at 0% 0%, #1c1713 0%, #14100d 58%, #100c0a 100%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 3%),
    0 6px 18px rgb(0 0 0 / 35%);
  font-size: 13px;
  line-height: 1.7;
  color: var(--c-text);
}

.stage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.stage-name {
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--c-primary);
}

.stage-scale {
  display: inline-flex;
  gap: 4px;
}

.stage-seg {
  display: block;
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: var(--c-border);
  transition: background 0.45s ease;
}

.stage-seg.on {
  background: var(--c-primary);
  box-shadow: 0 0 6px rgb(217 160 91 / 45%);
}

.mood {
  margin: 10px 0 0;
  padding-left: 9px;
  border-left: 2px solid rgb(217 160 91 / 40%);
  color: var(--c-text-muted);
  font-size: 12.5px;
}
</style>
