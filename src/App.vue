<template>
  <div id="app">
    <div class="p-3 border-bottom-1 surface-border">
      <div class="flex justify-content-between align-items-center">
        <h2 class="m-0 text-primary">User Management</h2>
        <div class="flex gap-2">
          <router-link to="/users">
            <Button label="Users" icon="pi pi-users" text />
          </router-link>
          <router-link to="/users/1">
            <Button label="User Detail" icon="pi pi-user" text />
          </router-link>
        </div>
      </div>
    </div>

    <div class="p-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
</script>
