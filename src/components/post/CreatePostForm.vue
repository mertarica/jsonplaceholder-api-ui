<template>
  <div class="create-post">
    <h4>Create Post</h4>

    <!-- Validation Errors -->
    <div v-if="validationErrors.length" class="validation-errors">
      <Message
        v-for="error in validationErrors"
        :key="error"
        severity="warn"
        :closable="false"
        class="validation-error"
      >
        {{ error }}
      </Message>
    </div>

    <!-- Create Post Error -->
    <Message
      v-if="isError"
      severity="error"
      :closable="false"
      class="form-error"
    >
      Failed to create post. Please try again.
    </Message>

    <form @submit.prevent="handleSubmit" class="post-form">
      <InputText
        v-model="form.title"
        placeholder="Post title..."
        :disabled="isPending"
        :class="{ 'p-invalid': titleError }"
      />
      <small v-if="titleError" class="p-error">{{ titleError }}</small>

      <Textarea
        v-model="form.body"
        placeholder="Write something..."
        :disabled="isPending"
        rows="3"
        :class="{ 'p-invalid': bodyError }"
      />
      <small v-if="bodyError" class="p-error">{{ bodyError }}</small>

      <Button
        type="submit"
        label="Publish"
        icon="pi pi-send"
        :loading="isPending"
        :disabled="!isFormValid"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue';
import { z } from 'zod';

interface Props {
  isPending: boolean;
  isError: boolean;
}

interface Emits {
  (e: 'submit', data: { title: string; body: string }): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const form = reactive({
  title: '',
  body: '',
});

const validationErrors = ref<string[]>([]);
const titleError = ref('');
const bodyError = ref('');

const isFormValid = computed(() => {
  return (
    form.title.trim() &&
    form.body.trim() &&
    !titleError.value &&
    !bodyError.value
  );
});

// Real-time validation
watch(
  () => form.title,
  (newTitle) => {
    try {
      z.string().min(1, 'Title is required').parse(newTitle.trim());
      titleError.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        titleError.value = error.errors[0]?.message || 'Invalid title';
      }
    }
  }
);

watch(
  () => form.body,
  (newBody) => {
    try {
      z.string().min(1, 'Body is required').parse(newBody.trim());
      bodyError.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        bodyError.value = error.errors[0]?.message || 'Invalid body';
      }
    }
  }
);

const handleSubmit = () => {
  emit('submit', {
    title: form.title.trim(),
    body: form.body.trim(),
  });

  // Clear form after successful submission
  form.title = '';
  form.body = '';
  titleError.value = '';
  bodyError.value = '';
  validationErrors.value = [];
};

defineExpose({
  clearForm: handleSubmit,
});
</script>

<style scoped>
.create-post {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
}

.create-post h4 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-error {
  margin-bottom: 1rem;
}

.validation-errors {
  margin-bottom: 1rem;
}

.validation-error {
  margin-bottom: 0.5rem;
}

.p-error {
  color: var(--error-500);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
