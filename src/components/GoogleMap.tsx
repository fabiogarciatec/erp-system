/// <reference types="google.maps" />
import { Box, Text, Spinner, Center, useToast, useColorMode } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap as GoogleMapComponent, useLoadScript } from '@react-google-maps/api';
import { Company } from '../types/company';

interface GoogleMapProps {
  company: Company;
  height?: string;
  states: Array<{ id: number; uf: string; name: string }>;
  latitude?: number | null;
  longitude?: number | null;
  onMapClick?: (lat: number, lng: number) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  address?: string;
}

type Libraries = ('places' | 'geometry' | 'marker')[];

// Define as bibliotecas fora do componente para evitar recriação
const libraries: Libraries = ['places', 'geometry', 'marker'];

interface MapCoordinates {
  lat: number;
  lng: number;
}

const DEFAULT_ZOOM = 15;
const DEFAULT_CENTER: MapCoordinates = { lat: -1.4557, lng: -48.4902 }; // Belém

export function GoogleMap({ company, height = '400px', states, latitude, longitude, onMapClick, onLocationSelect, address }: GoogleMapProps) {
  const { colorMode } = useColorMode();
  const [center, setCenter] = useState<MapCoordinates>(DEFAULT_CENTER);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const toast = useToast();

  // Verifica a chave da API
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: libraries
  });

  // Gera o endereço completo para geocodificação
  const fullAddress = useCallback(() => {
    if (!company) return '';
    const state = states.find(s => s.id === company.state_id);
    const stateUF = state?.uf || '';
    
    // Limpa o CEP removendo caracteres não numéricos
    const cleanCep = company.postal_code ? company.postal_code.replace(/\D/g, '') : '';
    const formattedCep = cleanCep.length === 8 ? `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}` : '';
    
    // Construindo endereço mais detalhado para melhor precisão
    const components = [
      company.address && company.address_number 
        ? `${company.address}, ${company.address_number}` 
        : company.address,
      company.address_complement,
      company.neighborhood,
      company.city,
      stateUF,
      formattedCep,
      'Brasil'
    ].filter(Boolean); // Remove itens vazios
    
    return components.join(', ');
  }, [company, states]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    if (onMapClick) {
      onMapClick(newPosition.lat, newPosition.lng);
    }
    
    if (onLocationSelect) {
      onLocationSelect(newPosition.lat, newPosition.lng);
    }

    setCenter(newPosition);
  }, [onMapClick, onLocationSelect]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const geocodeAddress = useCallback(async () => {
    if (!apiKey) {
      setError('API key não encontrada');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Se já temos coordenadas, use-as
      if (latitude && longitude) {
        const newCenter = { lat: latitude, lng: longitude };
        setCenter(newCenter);
        return;
      }

      // Se não temos coordenadas mas temos endereço, geocodifica
      const addressToGeocode = address || fullAddress();
      if (!addressToGeocode) {
        setCenter(DEFAULT_CENTER);
        return;
      }

      console.log('Geocodificando endereço:', addressToGeocode);

      // Tenta primeiro com o CEP se disponível
      let geocodeResult = null;
      if (company?.postal_code) {
        const cleanCep = company.postal_code.replace(/\D/g, '');
        if (cleanCep.length === 8) {
          geocodeResult = await geocodeWithComponents([
            `postal_code:${cleanCep}`,
            'country:BR'
          ]);
        }
      }

      // Se não encontrar com CEP, tenta com endereço completo
      if (!geocodeResult) {
        geocodeResult = await geocodeWithAddress(addressToGeocode);
      }

      // Se ainda não encontrar, tenta com componentes estruturados
      if (!geocodeResult && company) {
        const components = [];
        
        if (company.city) {
          components.push(`locality:${company.city}`);
        }
        
        const state = states.find(s => s.id === company.state_id);
        if (state?.uf) {
          components.push(`administrative_area:${state.uf}`);
        }
        
        components.push('country:BR');
        
        geocodeResult = await geocodeWithComponents(components);
      }

      if (!geocodeResult) {
        throw new Error('Endereço não encontrado');
      }

      setCenter(geocodeResult);

    } catch (error) {
      console.error('Erro ao geocodificar:', error);
      setError(error instanceof Error ? error.message : 'Erro ao geocodificar endereço');
      setCenter(DEFAULT_CENTER);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, address, fullAddress, latitude, longitude, company, states]);

  // Função auxiliar para geocodificar com endereço
  const geocodeWithAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&region=br&language=pt-BR&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'ZERO_RESULTS') {
        return null;
      }

      if (data.status !== 'OK') {
        throw new Error(`Erro na geocodificação: ${data.status}`);
      }

      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      };
    } catch (error) {
      console.error('Erro na geocodificação com endereço:', error);
      return null;
    }
  };

  // Função auxiliar para geocodificar com componentes
  const geocodeWithComponents = async (components: string[]) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?components=${components.join(
          '|'
        )}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'ZERO_RESULTS') {
        return null;
      }

      if (data.status !== 'OK') {
        throw new Error(`Erro na geocodificação: ${data.status}`);
      }

      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      };
    } catch (error) {
      console.error('Erro na geocodificação com componentes:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, loadError, geocodeAddress]);

  if (!apiKey) {
    return (
      <Center h={height}>
        <Text color="red.500">Erro: Chave da API do Google Maps não configurada</Text>
      </Center>
    );
  }

  if (!isLoaded) {
    return (
      <Center h={height} bg="blackAlpha.100" borderRadius="md">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (loadError) {
    return (
      <Center h={height} bg="blackAlpha.100" borderRadius="md">
        <Text color="red.500">Erro ao carregar o Google Maps</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={height} bg="blackAlpha.100" borderRadius="md">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    mapId: colorMode === 'dark' ? 'dark-mode-map' : 'light-mode-map',
    mapTypeId: 'roadmap',
    gestureHandling: 'greedy', // Permite arrastar no mobile sem precisar de dois dedos
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    scaleControl: true,
    rotateControl: true
  };

  return (
    <Box 
      h={height} 
      minH={{ base: "400px", md: "450px", lg: "500px" }}
      maxH={{ base: "calc(100vh - 200px)", md: "700px" }}
      w={{ base: "100%", md: "calc(100% + 6rem)" }}
      mx={{ base: 0, md: "-3rem" }}
      borderRadius={{ base: "md", md: "lg" }}
      overflow="hidden" 
      position="relative"
      flex="1"
      boxShadow="lg"
      bg="white"
      _dark={{ bg: "gray.800" }}
    >
      <GoogleMapComponent
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          minHeight: 'inherit',
          maxHeight: 'inherit',
          borderRadius: 'inherit'
        }}
        center={center}
        zoom={DEFAULT_ZOOM}
        onClick={handleMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          ...mapOptions,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          }
        }}
      >
        {center && window.google && mapRef.current && (
          <div
            ref={(element) => {
              if (element && window.google && mapRef.current) {
                const position = new window.google.maps.LatLng(center.lat, center.lng);
                
                if (markerRef.current) {
                  markerRef.current.position = position;
                } else {
                  const pin = new google.maps.marker.PinElement({
                    scale: 1.2,
                    glyph: '📍',
                    background: colorMode === 'dark' ? '#2D3748' : '#3182CE',
                    borderColor: colorMode === 'dark' ? '#4A5568' : '#2B6CB0',
                  });

                  const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: mapRef.current,
                    position,
                    gmpDraggable: true,
                    title: 'Localização',
                    content: pin.element
                  });

                  marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                      const newPosition = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                      };
                      setCenter(newPosition);
                      if (onLocationSelect) {
                        onLocationSelect(newPosition.lat, newPosition.lng);
                      }
                    }
                  });

                  markerRef.current = marker;
                }
              }
            }}
          />
        )}
      </GoogleMapComponent>
      {isLoading && (
        <Center
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.300"
          zIndex="1"
        >
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      )}
    </Box>
  );
}
