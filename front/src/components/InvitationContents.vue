<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Schedule } from '@/components/schedule'
import CarouselCard from './CarouselCard.vue'
import MessageCard from './MessageCard.vue'
import FormCard from './FormCard.vue'
import ScheduleCard from './ScheduleCard.vue'
import LocationCard from '@/components/LocationCard.vue'
import CountDown from '@/components/CountDown.vue'
import img1 from '@/assets/koma01.jpg'
import img2 from '@/assets/koma02.jpg'
import img3 from '@/assets/koma03.jpg'
import topVideo from '@/assets/top.MOV'
import { loadInvitationAssets } from '@/services/invitation-assets'

const staticImages = [img1, img2, img3]
const middleImages = ref([...staticImages])
const heroVideoSrc = ref(topVideo)

onMounted(async () => {
  try {
    const assets = await loadInvitationAssets()
    if (assets.heroVideo) {
      heroVideoSrc.value = assets.heroVideo
    }
    for (let i = 0; i < assets.carousel.length; i++) {
      if (assets.carousel[i]) {
        middleImages.value[i] = assets.carousel[i]!
      }
    }
  } catch {
    // Fallback to static assets silently
  }
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

const handlePlay = async () => {
  if (!videoRef.value) return
  try {
    videoRef.value.muted = false
    await videoRef.value.play()
    isPlaying.value = true
  } catch (error) {
    console.error('動画の再生に失敗しました', error)
  }
}

const props = defineProps({
  schedule: {
    type: Array<Schedule>,
    required: true
  },
  location: {
    type: String,
    required: true
  }
})
</script>

<template>
  <v-card class="pa-4">
    <v-row>
      <v-col cols="12" lg="12" md="12" sm="12" xs="12">
        <v-responsive
          aspect-ratio="16/9"
          class="rounded-lg overflow-hidden elevation-1 position-relative"
        >
          <video
            ref="videoRef"
            :src="heroVideoSrc"
            loop
            playsinline
            class="w-100 h-100"
            style="object-fit: cover"
            controls
          />
        </v-responsive>
      </v-col>
      <v-col cols="12" lg="12" md="12" sm="12" xs="12">
        <MessageCard />
      </v-col>
    </v-row>
  </v-card>
  <CountDown class="mt-4" />
  <CarouselCard :image-list="middleImages" class="mt-4" />
  <ScheduleCard :schedule="props.schedule" />
  <v-card>
    <LocationCard :location="props.location" />
    <FormCard />
  </v-card>
</template>

<style scoped>
.position-relative {
  position: relative;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
</style>
