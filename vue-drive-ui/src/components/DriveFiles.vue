<template>
  <div>
    <h1>Google Drive Files</h1>

    <label>
      Modified After:
      <input type="date" v-model="modifiedAfter" />
    </label>

    <label>
      Modified Before:
      <input type="date" v-model="modifiedBefore" />
    </label>

    <button @click="fetchFiles">Apply Filter</button>

    <table v-if="files.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Modified</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.name }}</td>
          <td>{{ file.owners?.map((o: { emailAddress: any; }) => o.emailAddress).join(', ') }}</td>
          <td>{{ formatDate(file.modifiedTime) }}</td>
          <td>
            <a :href="file.webViewLink" target="_blank">Open</a>
          </td>
          <td>
            <button @click="viewFile(file.id)">View</button>
            <button @click="renameFile(file.id)">Rename</button>
            <button @click="deleteFile(file.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>No files found</div>

    <AskAI :files="files" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AskAI from './AskAi.vue';
import axios from 'axios';

const files = ref<any[]>([]);
const modifiedAfter = ref('');
const modifiedBefore = ref('');

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function toRFC3339(date: string) {
  return new Date(date).toISOString();
}

async function fetchFiles() {
  const params: any = {};

  if (modifiedAfter.value) {
    params.modifiedAfter = toRFC3339(modifiedAfter.value);
  }

  if (modifiedBefore.value) {
    params.modifiedBefore = toRFC3339(modifiedBefore.value);
  }

  const res = await axios.get('http://localhost:3000/files', { params });
  files.value = res.data;
}

function viewFile(id: string) {
  window.open(`https://drive.google.com/file/d/${id}/view`, '_blank');
}

async function renameFile(id: string) {
  const newName = prompt('Enter new file name');
  if (!newName) return;

  await axios.patch(`http://localhost:3000/files/${id}`, {
    name: newName,
  });

  fetchFiles(); // refresh list
}

async function deleteFile(id: string) {
  if (!confirm('Are you sure you want to delete this file?')) return;

  await axios.delete(`http://localhost:3000/files/${id}`);
  files.value = files.value.filter(f => f.id !== id);
}

onMounted(fetchFiles);
</script>