<template>
  <div class="body-state">
    <span class="chip" :class="{ on: inBed }">{{ inBed ? '她在床上' : '她不在床上' }}</span>
    <span class="chip">{{ sleep }}</span>
    <span class="chip ellipsis" :title="pajamas">{{ pajamas }}</span>
    <span class="chip ellipsis" :title="blanket">{{ blanket }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sleep: string;
  inBed: boolean;
  pajamas: string;
  blanket: string;
}>();
</script>

<style scoped>
.body-state {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 11px;
}

.chip {
  max-width: 15em;
  padding: 1px 8px;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: var(--c-surface-raised);
  color: var(--c-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.chip.on {
  border-color: rgb(217 160 91 / 35%);
  color: var(--c-primary);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
