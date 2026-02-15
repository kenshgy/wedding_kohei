<template>
  <v-row class="d-md-none" justify="end">
    <v-col>
      <v-btn @click="() => router.push('/upload')">
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Back
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col
      v-for="(j, index) in imageList"
      :key="index"
      cols="12"
      :md="colCount"
      align-self="center"
    >
      <v-img
        :src="'/api/photos/' + encodeURIComponent(j.name)"
        class="mb-4 mx-2"
        :alt="j.name"
      />
    </v-col>
  </v-row>
  <v-row class="d-md-block">
    <v-col>
      <v-btn @click="show3Piece">横に3つ表示する</v-btn>
    </v-col>
    <v-col>
      <v-btn @click="show2Piece">横に2つ表示する</v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import getPhotoListApi from '@/services/get-photoList'
import { onMounted } from 'vue'
import router from '@/router'

const colCount = ref(4)
function show3Piece() {
  colCount.value = 4
}
function show2Piece() {
  colCount.value = 6
}

const start = ''
interface PhotoInfo {
  name: string
  size: string
  lastModified: string
  presignedUrl: string
}
let imageList = ref<PhotoInfo[]>([])

function parseDate(dateString: string) {
  return new Date(dateString)
}

async function getPhotoList(startAfter: string) {
  const response: PhotoInfo[] = await getPhotoListApi.get(startAfter)
  response.sort((a, b) => {
    const dateA = parseDate(a.lastModified)
    const dateB = parseDate(b.lastModified)
    return dateB.getTime() - dateA.getTime()
  })

  const lastStoredTimestamp =
    imageList.value.length > 0 ? new Date(imageList.value[0].lastModified).getTime() : 0

  const newPhotos = response.filter((photo) => {
    const photoTimestamp = new Date(photo.lastModified).getTime()
    return photoTimestamp > lastStoredTimestamp
  })

  imageList.value.unshift(...newPhotos)
  return newPhotos
}

onMounted(async () => {
  imageList.value = await getPhotoList(start)
  setInterval(async () => {
    await getPhotoList(start)
  }, 10000)
})
</script>
