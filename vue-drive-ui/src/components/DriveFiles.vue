<template>
  <div style="display: flex; flex-direction: column; gap: 50px;">
    <div>      
      <h1>Google Drive Files</h1>

      <label>
        Modified After:
         <VueDatePicker v-model="modifiedAfter" />
      </label>

      <label>
        Modified Before:
         <VueDatePicker v-model="modifiedBefore" />
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
    </div>

    <div>
      <AskAI :files="files" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AskAI from './AskAi.vue';
import axios from 'axios';
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { apis } from '../config/globals';

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

  const res = await axios.get(apis.filesApi, { params });
  files.value = res.data;
}

function viewFile(id: string) {
  window.open(`${apis.googleDriveApi}/${id}/view`, '_blank');
}

async function renameFile(id: string) {
  const newName = prompt('Enter new file name');
  if (!newName) return;

  await axios.patch(`${apis.filesApi}/${id}`, {
    name: newName,
  });

  fetchFiles(); // refresh list
}

async function deleteFile(id: string) {
  if (!confirm('Are you sure you want to delete this file?')) return;

  await axios.delete(`${apis.filesApi}/${id}`);
  files.value = files.value.filter(f => f.id !== id);
}

onMounted(fetchFiles);
</script>