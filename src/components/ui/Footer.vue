<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>&copy; {{ currentYear }} UserHub. Built with Vue 3</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background: #f8fafc;
  border-top: 1px solid #e1e5e9;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
