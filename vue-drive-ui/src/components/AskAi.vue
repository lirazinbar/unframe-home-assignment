<template>
  <div class="container">
    <h1>Drive AI Search</h1>

    <input
      v-model="question"
      @keyup.enter="ask"
      placeholder="Ask a question about your files..."
    />

    <button @click="ask">Ask</button>

    <div v-if="loading">Thinking...</div>

    <div v-if="answer" class="answer">
      {{ answer }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { apis } from '../config/globals';

const question = ref('');
const answer = ref('');
const loading = ref(false);

async function ask() {
  if (!question.value) return;

  loading.value = true;
  answer.value = '';

  const res = await axios.post(apis.aiAskApi, {
    question: question.value,
  });

  answer.value = res.data;
  loading.value = false;
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
input {
  width: 100%;
  padding: 10px;
}
.answer {
  margin-top: 20px;
  font-size: 18px;
}
</style>
