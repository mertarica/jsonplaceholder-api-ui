<!-- filepath: src/pages/ErrorPage.vue -->
<template>
  <div class="error-page">
    <Card class="error-card">
      <template #header>
        <div class="error-header">
          <i :class="errorIcon" class="error-icon"></i>
          <h2>{{ errorTitle }}</h2>
        </div>
      </template>

      <template #content>
        <div class="error-content">
          <p class="error-message">{{ errorMessage }}</p>

          <div class="error-actions">
            <Button
              label="Go to Users"
              icon="pi pi-users"
              @click="goToUsers"
              class="primary-btn"
            />
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="goBack"
              class="secondary-btn"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  notFound?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  notFound: false,
});

const router = useRouter();

const errorIcon = computed(() =>
  props.notFound ? 'pi pi-search' : 'pi pi-exclamation-triangle'
);

const errorTitle = computed(() =>
  props.notFound ? 'Page Not Found' : 'Something Went Wrong'
);

const errorMessage = computed(() =>
  props.notFound
    ? 'The page you are looking for does not exist.'
    : 'An unexpected error occurred. Please try again.'
);

const goToUsers = () => {
  router.push('/users');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-header {
  padding: 2rem;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.error-content {
  padding: 2rem;
}

.error-message {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-actions {
    flex-direction: column;
  }

  .error-actions .p-button {
    width: 100%;
  }
}
</style>
