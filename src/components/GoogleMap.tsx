/// <reference types="google.maps" />
import { Box, Text, Spinner, Center, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap as GoogleMapComponent, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Company } from '../types/company';

interface GoogleMapProps {
  company: Company;
  height?: string;
  states: Array<{ id: number; uf: string; name: string }>;
  latitude?: number | null;
  longitude?: number | null;
  onMapClick?: (lat: number, lng: number) => void;
}

type Libraries = ('places' | 'geometry')[];

// Define as bibliotecas fora do componente para evitar recriação
const libraries: Libraries = ['places', 'geometry'];

interface MapCoordinates {
  lat: number;
  lng: number;
}

const DEFAULT_ZOOM = 15;
const DEFAULT_CENTER: MapCoordinates = { lat: -1.4557, lng: -48.4902 }; // Belém

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  gestureHandling: 'cooperative',
  mapTypeControl: false,
  isFractionalZoomEnabled: true,
  zoomControl: true,
  streetViewControl: true,
  mapTypeId: 'roadmap'
};

export function GoogleMap({ company, height = '400px', states, latitude, longitude, onMapClick }: GoogleMapProps) {
  const [center, setCenter] = useState<MapCoordinates>(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const toast = useToast();

  // Verifica a chave da API
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Chave da API do Google Maps não encontrada no .env');
    return (
      <Center h={height}>
        <Text color="red.500">Erro: Chave da API do Google Maps não configurada</Text>
      </Center>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries
  });

  // Gera o endereço completo para geocodificação
  const fullAddress = useCallback(() => {
    if (!company) return '';
    
    const parts = [
      company.address && company.address_number 
        ? `${company.address}, ${company.address_number}`
        : company.address,
      company.neighborhood,
      company.city && states.find(s => s.id === company.state_id)?.uf
        ? `${company.city} - ${states.find(s => s.id === company.state_id)?.uf}`
        : company.city,
      'Brasil'
    ].filter(Boolean);
    
    return parts.join(', ');
  }, [company, states]);

  // Busca e atualiza as coordenadas
  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Se temos coordenadas diretas, usa elas
        if (typeof latitude === 'number' && typeof longitude === 'number' && 
            latitude !== 0 && longitude !== 0) {
          const newCenter = { lat: latitude, lng: longitude };
          setCenter(newCenter);
          return;
        }

        // Se temos coordenadas da empresa, usa elas
        if (company?.latitude && company?.longitude && 
            Number(company.latitude) !== 0 && Number(company.longitude) !== 0) {
          const newCenter = {
            lat: Number(company.latitude),
            lng: Number(company.longitude)
          };
          setCenter(newCenter);
          return;
        }

        // Se não temos coordenadas mas temos endereço, geocodifica
        const address = fullAddress();
        if (!address) {
          setCenter(DEFAULT_CENTER);
          return;
        }

        console.log('Geocodificando endereço:', address);

        let response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        let data = await response.json();
        console.log('Resposta da geocodificação:', data);

        if (data.status === 'REQUEST_DENIED') {
          throw new Error(`Erro de API: ${data.error_message || 'Chave da API do Google Maps inválida'}`);
        }

        if (data.status === 'OK' && data.results[0]) {
          const newCenter = {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng
          };
          setCenter(newCenter);
          
          if ((!company.latitude && !company.longitude) || 
              (Number(company.latitude) === 0 && Number(company.longitude) === 0)) {
            onMapClick?.(newCenter.lat, newCenter.lng);
          }
        } else {
          setCenter(DEFAULT_CENTER);
          toast({
            title: "Aviso",
            description: "Usando localização padrão pois não foi possível encontrar o endereço",
            status: "warning",
            duration: 5000,
            isClosable: true
          });
        }
      } catch (err) {
        console.error('Erro ao geocodificar:', err);
        setError('Erro ao carregar o mapa');
        setCenter(DEFAULT_CENTER);
        toast({
          title: "Erro",
          description: err instanceof Error ? err.message : "Erro ao carregar o mapa",
          status: "error",
          duration: 5000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [apiKey, company?.address, company?.city, company?.state_id, company?.latitude, company?.longitude, fullAddress, latitude, longitude, onMapClick, toast, states]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !onMapClick) return;
    
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setCenter(newPosition);
    onMapClick(newPosition.lat, newPosition.lng);
  }, [onMapClick]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  return (
    <Box h={height} position="relative">
      {error && (
        <Center h="full">
          <Text color="red.500">{error}</Text>
        </Center>
      )}

      {isLoading && (
        <Center h="full" position="absolute" top="0" left="0" right="0" bottom="0" bg="whiteAlpha.800" zIndex={1}>
          <Spinner size="xl" />
        </Center>
      )}

      {isLoaded && !loadError ? (
        <GoogleMapComponent
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={DEFAULT_ZOOM}
          center={center}
          options={mapOptions}
          onClick={handleMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MarkerF
            position={center}
            draggable={true}
            onDragEnd={(e) => {
              if (e.latLng && onMapClick) {
                const newPosition = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                };
                setCenter(newPosition);
                onMapClick(newPosition.lat, newPosition.lng);
              }
            }}
          />
        </GoogleMapComponent>
      ) : (
        <Center h="full">
          <Text color="red.500">
            {loadError ? 'Erro ao carregar o Google Maps' : 'Carregando...'}
          </Text>
        </Center>
      )}
    </Box>
  );
}
