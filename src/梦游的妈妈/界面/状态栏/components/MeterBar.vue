<template>
  <div class="meter" :class="`tone-${tone}`" :title="note">
    <span class="meter-label">{{ label }}</span>
    <span class="meter-track">
      <span class="meter-fill" :style="{ width: `${clamped}%` }"></span>
    </span>
    <span class="meter-value">{{ clamped }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: number;
  tone: 'heat' | 'sink' | 'attach';
  note?: string;
}>();

const clamped = computed(() => Math.max(0, Math.min(100, Math.round(props.value ?? 0))));
</script>

<style scoped>
.meter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}

.meter-label {
  width: 2.6em;
  color: var(--c-text-muted);
  font-size: 12px;
}

.meter-track {
  flex: 1;
  height: 4px;
  border-radius: 3px;
  background: var(--c-surface-sunken);
  overflow: hidden;
}

.meter-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  transition: width 0.45s ease;
}

.tone-heat .meter-fill {
  background: linear-gradient(90deg, #8f4a34, var(--c-heat));
}

.tone-sink .meter-fill {
  background: linear-gradient(90deg, #5c4550, var(--c-sink));
}

.tone-attach .meter-fill {
  background: linear-gradient(90deg, #6a5433, var(--c-attach));
}

.meter-value {
  width: 2.2em;
  color: var(--c-text-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
</style>
