<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <RouterLink to="/" class="logo-link">
          <i class="pi pi-users"></i>
          <h1>UserHub</h1>
        </RouterLink>
      </div>

      <nav class="nav">
        <router-link to="/users" class="nav-link">
          <Button label="Users" icon="pi pi-list" text />
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1f2937;
}

.logo i {
  color: #3b82f6;
  font-size: 1.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  text-decoration: none;
  transition: transform 0.5s;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.router-link-active .p-button {
  background-color: #3b82f6 !important;
  color: white !important;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
