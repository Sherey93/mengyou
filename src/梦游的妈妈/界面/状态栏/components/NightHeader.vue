<template>
  <header class="head">
    <div class="head-left">
      <span class="clock">{{ clock }}</span>
      <span class="sep">·</span>
      <span>周{{ weekday }}</span>
      <span class="sep">·</span>
      <span class="scene">{{ scene }}</span>
    </div>
    <div class="head-right" :class="`lv-${fatherLevel}`">
      <span class="lamp" aria-hidden="true"></span>
      <span class="father">{{ fatherLabel }}</span>
      <span v-if="suspicion >= 40" class="suspicion">疑 {{ suspicion }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  clock: string;
  weekday: string;
  scene: string;
  fatherLabel: string;
  fatherLevel: string;
  suspicion: number;
}>();
</script>

<style scoped>
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}

.head-left {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 12px;
}

.clock {
  color: var(--c-text);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.sep {
  color: var(--c-border);
}

.scene {
  color: var(--c-text-muted);
}

.head-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  white-space: nowrap;
}

.lamp {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-calm);
  box-shadow: 0 0 6px var(--c-calm);
}

.lv-alert .lamp {
  background: var(--c-danger);
  box-shadow: 0 0 8px var(--c-danger);
  animation: breathe 2.6s ease-in-out infinite;
}

.lv-muted .lamp {
  background: var(--c-text-muted);
  box-shadow: none;
}

.lv-calm .father {
  color: var(--c-calm);
}

.lv-alert .father {
  color: var(--c-danger);
}

.lv-muted .father {
  color: var(--c-text-muted);
}

.suspicion {
  color: var(--c-danger);
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}
</style>
