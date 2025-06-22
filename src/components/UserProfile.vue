<template>
  <Card class="profile-card">
    <template #header>
      <div class="profile-header">
        <Avatar
          :label="user.name.charAt(0)"
          size="xlarge"
          class="profile-avatar"
        />
        <h2>{{ user.name }}</h2>
        <p>@{{ user.username }}</p>
      </div>
    </template>

    <template #content>
      <div class="profile-details">
        <div class="detail">
          <i class="pi pi-envelope"></i>
          <div>
            <label>Email</label>
            <span>{{ user.email }}</span>
          </div>
        </div>

        <div class="detail">
          <i class="pi pi-phone"></i>
          <div>
            <label>Phone</label>
            <span>{{ user.phone }}</span>
          </div>
        </div>

        <div class="detail">
          <i class="pi pi-globe"></i>
          <div>
            <label>Website</label>
            <span>{{ user.website }}</span>
          </div>
        </div>

        <div class="detail">
          <i class="pi pi-map-marker"></i>
          <div>
            <label>Address</label>
            <span>{{ user.address.street }}, {{ user.address.city }}</span>
          </div>
        </div>

        <div class="detail">
          <i class="pi pi-building"></i>
          <div>
            <label>Company</label>
            <span>{{ user.company.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { User } from '@/schemas/user';

interface Props {
  user: User;
}

defineProps<Props>();
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
  border: none !important;
}

/* Override PrimeVue Card styles */
.profile-card :deep(.p-card-header),
.profile-card :deep(.p-card-content),
.profile-card :deep(.p-card-body) {
  background: transparent !important;
  color: inherit !important;
  border: none !important;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  gap: 1rem;
}

.profile-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.profile-header p {
  margin: 0;
  opacity: 0.8;
}

.profile-avatar {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 2rem 2rem;
}

.detail {
  display: flex;
  gap: 1rem;
}

.detail i {
  margin-top: 2px;
  opacity: 0.8;
}

.detail label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.detail span {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: row;
    text-align: left;
  }

  .profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }
}
</style>
