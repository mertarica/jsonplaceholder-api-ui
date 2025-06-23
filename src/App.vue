<template>
  <div id="app">
    <ErrorBoundary
      fallback-title="Application Error"
      fallback-message="The application encountered an unexpected error."
      @error="handleGlobalError"
      @retry="handleRetry"
    >
      <Layout>
        <router-view />
      </Layout>
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import Layout from '@/components/ui/Layout.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';

const handleGlobalError = (error: Error, info: string) => {
  console.error('Application Error:', error);
  console.error('Error Info:', info);
  // we can trigger monitoring servies here like sentry etc.
};

const handleRetry = () => {
  window.location.reload();
};
</script>
