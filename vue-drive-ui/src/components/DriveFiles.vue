<template>
  <div>
    <h1>Google Drive Files</h1>

    <div v-if="loading">Loading...</div>
    <div v-if="error" style="color:red">{{ error }}</div>

    <table v-if="files.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Modified</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.name }}</td>
          <td>{{ file.owners?.map(o => o.emailAddress).join(', ') }}</td>
          <td>{{ formatDate(file.createdTime) }}</td>
          <td>{{ formatDate(file.modifiedTime) }}</td>
          <td>
            <a :href="file.webViewLink" target="_blank">Open</a>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading">No files found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface DriveFile {
  id: string;
  name: string;
  owners: { displayName: string; emailAddress: string }[];
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
}

const files = ref<DriveFile[]>([]);
const loading = ref(false);
const error = ref('');

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

async function fetchFiles() {
  loading.value = true;
  error.value = '';

  try {
    const res = await axios.get<DriveFile[]>('http://localhost:3000/files');
    console.log({res})
    files.value = res.data;
  } catch (err: any) {
    console.error(err);
    error.value = 'Failed to fetch files';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchFiles();
});
</script>