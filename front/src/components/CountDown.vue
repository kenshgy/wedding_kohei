<script setup lang="ts">
import { reactive } from 'vue'

const target = new Date(2026, 4, 16, 12, 0o0).getTime()
const count = reactive({
  date: 0,
  hour: 0,
  minute: 0,
  second: 0
})
function countdown() {
  const diff = target - Date.now()
  const numbers = [
    diff / 1000 / 60 / 60 / 24,
    (diff / 1000 / 60 / 60) % 24,
    (diff / 1000 / 60) % 60,
    (diff / 1000) % 60
  ]
  count.date = Math.floor(numbers[0])
  count.hour = Math.floor(numbers[1])
  count.minute = Math.floor(numbers[2])
  count.second = Math.floor(numbers[3])
}
function startCountDown(): void {
  setInterval(countdown, 1000)
}
startCountDown()
</script>

<template>
  <v-card class="countdown text-center count_down-bg">
    <v-row>
      <v-col class="title"> Countdown </v-col>
    </v-row>
    <v-row align="end">
      <v-col cols="3"></v-col>
      <v-col cols="4" class="py-0 time_main">
        {{ count.date }}
      </v-col>
      <v-col cols="3" class="time_sub">Days</v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <div class="time">
          {{ count.hour }}
        </div>
        <div class="time_sub">Hours</div>
      </v-col>
      <v-col cols="4">
        <div class="time">
          {{ count.minute }}
        </div>
        <div class="time_sub">Minutes</div>
      </v-col>
      <v-col cols="4">
        <div class="time">
          {{ count.second }}
        </div>
        <div class="time_sub">Seconds</div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.countdown {
  background-color: pink;
  background-image: url('../assets/flowerback.png');
  color: white;
}
.time_main {
  font-family: 'Dancing Script', cursive;
  font-size: 50px;
}
.time {
  font-family: 'Dancing Script', cursive;
  font-size: 40px;
}
.time_sub {
  font-family: 'Cookie', cursive;

  font-size: 20px;
}

.count_down-bg {
  background: url('@/assets/count-down.jpg');
  background-size: cover;
}
</style>
