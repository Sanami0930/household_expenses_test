<template>
  <div v-cloak>
    <v-app>
      <Header />
      <v-main>
        <nuxt />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Header from "@/components/header.vue";

export default {
  components: {
    Header,
  },
};
</script>
