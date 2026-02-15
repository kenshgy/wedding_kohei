import { createRouter, createWebHistory } from 'vue-router'
import InvitatioinView from '@/views/InvitatioinView.vue'
import IndexView from "@/views/indexView.vue"
import { reception, scheduleAll, koheiSchedule } from '@/components/schedule'
import {LOCATION_CEREMONY, LOCATION_RECEPTION} from '@/components/locations'
import UploadView from '@/views/UploadView.vue'
import AlbumView from "@/views/AlbumView.vue"
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: InvitatioinView,
      meta: {title: "Ken&Miki Wedding"}
    },    
    {
      path: '/invitation',
      name: 'invitation',
      props: {schedule: scheduleAll, location: LOCATION_CEREMONY},
      component: InvitatioinView,
      meta: {title: "Ken&Miki Wedding"}
    },
    {
      path: '/invite',
      name: 'invite',
      props: {schedule: reception, location: LOCATION_RECEPTION},
      component: InvitatioinView,
      meta: {title: "Ken&Miki Wedding"}
    },
    {
      path: '/kohei',
      name: 'kohei',
      props: {schedule: koheiSchedule, location: LOCATION_CEREMONY},
      component: InvitatioinView,
      meta: {title: "Ken&Miki Wedding"}
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
      meta: {title: "Ken&Miki Wedding"}
    },
    {
      path: '/album',
      name: 'album',
      component: AlbumView,
      meta: {title: "Ken&Miki Wedding"}
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {title: "Ken&Miki Wedding - Admin"}
    },
  ]
})

export default router
