<template>
  <!-- ツールバー -->
  <v-app-bar app color="blue" dark>
    <!-- タイトル -->
    <v-spacer></v-spacer>
    <!-- タイトルをセンターへ -->
    <v-toolbar-title>{{ appName }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <!-- テーブルアイコンのボタン -->
    <v-btn icon to="/">
      <v-icon>mdi-file-table</v-icon>
    </v-btn>

    <!-- 歯車アイコンのボタン -->
    <v-btn icon to="/settings">
      <v-icon>mdi-cog-box</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import { mapState } from 'vuex'
  // import store from './store'

export default {

  computed: mapState({
    appName: state => state.settings.appName
  }),

  // App インスタンス生成前に一度だけ実行
  beforeCreate(){
    this.$store.dispatch('loadSettings')
  },

  components: {}
};
</script>
