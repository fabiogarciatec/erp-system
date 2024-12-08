<template>
  <div ref="mapRef" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const props = defineProps<{
  latitude: number
  longitude: number
  zoom?: number
}>()

const mapRef = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const marker = ref<google.maps.Marker | null>(null)

const initMap = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly'
  })

  try {
    const google = await loader.load()
    const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary

    if (mapRef.value) {
      // Criar o mapa
      map.value = new Map(mapRef.value, {
        center: { lat: props.latitude, lng: props.longitude },
        zoom: props.zoom || 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      })

      // Adicionar marcador
      marker.value = new google.maps.Marker({
        position: { lat: props.latitude, lng: props.longitude },
        map: map.value,
        animation: google.maps.Animation.DROP
      })
    }
  } catch (error) {
    console.error('Erro ao carregar o mapa:', error)
  }
}

// Atualizar posição do marcador quando as coordenadas mudarem
watch(
  () => [props.latitude, props.longitude],
  ([newLat, newLng]) => {
    if (map.value && marker.value) {
      const newPosition = { lat: newLat, lng: newLng }
      marker.value.setPosition(newPosition)
      map.value.panTo(newPosition)
    }
  }
)

onMounted(() => {
  initMap()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
