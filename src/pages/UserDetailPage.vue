<template>
  <div>
    <h1>User Detail</h1>
    <p>User ID: {{ id }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
}

defineProps<Props>();

console.log('User Detail Page loaded');
</script>
