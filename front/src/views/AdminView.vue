<template>
  <v-container>
    <!-- Password Gate -->
    <v-card v-if="!authenticated" class="pa-4 mx-auto" max-width="400">
      <v-card-title>管理画面</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="パスワード"
          type="password"
          @keyup.enter="authenticate"
        />
        <p v-if="authError" class="text-red">パスワードが違います</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="pink" @click="authenticate">ログイン</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Admin Panel -->
    <div v-else>
      <v-card class="pa-4 mb-4">
        <v-card-title>招待状アセット管理</v-card-title>
      </v-card>

      <!-- Hero Video -->
      <v-card class="pa-4 mb-4">
        <v-card-subtitle>トップ動画</v-card-subtitle>
        <input type="file" accept="video/*" @change="(e) => handleFile(e, 'hero-video')" />
        <div v-if="previews['hero-video']" class="mt-2">
          <video :src="previews['hero-video']" controls style="max-width: 100%; max-height: 300px" />
        </div>
      </v-card>

      <!-- Carousel Images -->
      <v-card v-for="i in 3" :key="i" class="pa-4 mb-4">
        <v-card-subtitle>カルーセル画像 {{ i }}</v-card-subtitle>
        <input type="file" accept="image/*" @change="(e) => handleFile(e, `carousel-${i}` as InvitationAssetKey)" />
        <div v-if="previews[`carousel-${i}`]" class="mt-2">
          <img :src="previews[`carousel-${i}`]" style="max-width: 300px" />
        </div>
      </v-card>

      <!-- Upload Button -->
      <v-row justify="center" class="mb-4">
        <v-col cols="auto">
          <v-btn
            color="pink"
            :loading="uploading"
            :disabled="Object.keys(selectedFiles).length === 0"
            @click="uploadAll"
          >
            <v-icon start icon="mdi-upload" />
            一括アップロード
          </v-btn>
        </v-col>
      </v-row>

      <!-- Status -->
      <v-alert v-if="uploadResult" :type="uploadResult.type" class="mb-4">
        {{ uploadResult.message }}
      </v-alert>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { uploadInvitationAsset, type InvitationAssetKey } from '@/services/invitation-assets'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin'

const password = ref('')
const authenticated = ref(false)
const authError = ref(false)

function authenticate() {
  if (password.value === ADMIN_PASSWORD) {
    authenticated.value = true
    authError.value = false
  } else {
    authError.value = true
  }
}

const selectedFiles = reactive<Record<string, File>>({})
const previews = reactive<Record<string, string>>({})
const uploading = ref(false)
const uploadResult = ref<{ type: 'success' | 'error'; message: string } | null>(null)

function handleFile(event: Event, key: InvitationAssetKey) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    selectedFiles[key] = file

    const reader = new FileReader()
    reader.onload = () => {
      previews[key] = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function uploadAll() {
  uploading.value = true
  uploadResult.value = null

  try {
    const entries = Object.entries(selectedFiles) as [InvitationAssetKey, File][]
    await Promise.all(entries.map(([key, file]) => uploadInvitationAsset(key, file)))

    uploadResult.value = {
      type: 'success',
      message: `${entries.length}件のアセットをアップロードしました`
    }
    // Clear selections
    for (const key of Object.keys(selectedFiles)) {
      delete selectedFiles[key]
    }
  } catch (err) {
    console.error(err)
    uploadResult.value = {
      type: 'error',
      message: 'アップロードに失敗しました'
    }
  } finally {
    uploading.value = false
  }
}
</script>
