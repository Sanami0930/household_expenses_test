<template>
  <!-- ツールバー -->
  <v-app-bar app color="blue" dark>
    <!-- タイトル -->
    <v-spacer></v-spacer>
    <!-- タイトルをセンターへ -->
    <v-toolbar-title>GAS 家計簿 テスト</v-toolbar-title>

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
export default {
  components: {},
};
</script>
