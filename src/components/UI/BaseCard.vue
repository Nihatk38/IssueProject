<template>
  <div>
<slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseCard"
}
</script>

<style scoped>
div{
  margin: 2rem 1rem ;
  max-width: 60rem;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);

}
</style>