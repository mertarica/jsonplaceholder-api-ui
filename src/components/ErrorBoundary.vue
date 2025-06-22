<template>
  <div v-if="hasError" class="error-boundary">
    <Card class="error-card">
      <template #header>
        <div class="error-header">
          <i class="pi pi-exclamation-triangle error-icon"></i>
          <h3>{{ errorTitle }}</h3>
        </div>
      </template>

      <template #content>
        <div class="error-content">
          <p class="error-message">{{ errorMessage }}</p>

          <div v-if="showDetails" class="error-details">
            <h4>Technical Details:</h4>
            <pre class="error-stack">{{ errorDetails }}</pre>
          </div>

          <div class="error-actions">
            <Button
              label="Retry"
              icon="pi pi-refresh"
              @click="retry"
              class="retry-btn"
            />
            <Button
              label="Go Home"
              icon="pi pi-home"
              severity="secondary"
              @click="goHome"
              class="home-btn"
            />
            <Button
              :label="showDetails ? 'Hide Details' : 'Show Details'"
              :icon="showDetails ? 'pi pi-eye-slash' : 'pi pi-eye'"
              text
              @click="toggleDetails"
              class="details-btn"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  fallbackTitle?: string;
  fallbackMessage?: string;
  showRetry?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: 'Something went wrong',
  fallbackMessage: 'An unexpected error occurred. Please try again.',
  showRetry: true,
});

const emit = defineEmits<{
  error: [error: Error, info: string];
  retry: [];
}>();

const router = useRouter();

const hasError = ref(false);
const errorTitle = ref('');
const errorMessage = ref('');
const errorDetails = ref('');
const showDetails = ref(false);

onErrorCaptured((error: Error, instance, info: string) => {
  console.error('Error Boundary caught error:', error);
  console.error('Component instance:', instance);
  console.error('Error info:', info);

  hasError.value = true;
  errorTitle.value = props.fallbackTitle;
  errorMessage.value = error.message || props.fallbackMessage;
  errorDetails.value = error.stack || 'No stack trace available';

  emit('error', error, info);
  return false;
});

const retry = () => {
  hasError.value = false;
  errorTitle.value = '';
  errorMessage.value = '';
  errorDetails.value = '';
  showDetails.value = false;
  emit('retry');
};

const goHome = () => {
  router.push('/users');
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>

<style scoped>
.error-boundary {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.error-card {
  border: 1px solid #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
}

.error-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.error-icon {
  font-size: 2rem;
  color: #ef4444;
}

.error-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.error-content {
  padding: 1.5rem;
}

.error-message {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.error-details {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.error-details h4 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.error-stack {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.retry-btn {
  background-color: #ef4444;
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .error-boundary {
    padding: 1rem;
  }

  .error-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .p-button {
    width: 100%;
  }
}
</style>
