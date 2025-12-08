<script setup lang="ts">
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

const middleImages = [img1, img2, img3]
const heroVideoSrc = topVideo

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
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-responsive aspect-ratio="16/9" class="rounded-lg overflow-hidden elevation-1">
          <video
            :src="heroVideoSrc"
            autoplay
            muted
            loop
            playsinline
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </v-responsive>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
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

<style scoped></style>
