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
import { errorService } from './services/errorService';

const handleGlobalError = (error: Error, info: string) => {
  errorService.logError(error, {
    context: 'global-error-boundary',
    info,
  });
};

const handleRetry = () => {
  window.location.reload();
};
</script>
