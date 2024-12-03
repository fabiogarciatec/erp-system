import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference types="google.maps" />
import { Box, Text, Spinner, Center, useToast, useColorMode } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap as GoogleMapComponent, MarkerF, useLoadScript } from '@react-google-maps/api';
// Define as bibliotecas fora do componente para evitar recriação
const libraries = ['places', 'geometry'];
const DEFAULT_ZOOM = 15;
const DEFAULT_CENTER = { lat: -1.4557, lng: -48.4902 }; // Belém
// Estilo dark para o mapa
const darkModeStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];
const mapOptions = {
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
export function GoogleMap({ company, height = '400px', states, latitude, longitude, onMapClick }) {
    const { colorMode } = useColorMode();
    const [center, setCenter] = useState(DEFAULT_CENTER);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef(null);
    const toast = useToast();
    // Verifica a chave da API
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.error('Chave da API do Google Maps não encontrada no .env');
        return (_jsx(Center, { h: height, children: _jsx(Text, { color: "red.500", children: "Erro: Chave da API do Google Maps n\u00E3o configurada" }) }));
    }
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries
    });
    // Gera o endereço completo para geocodificação
    const fullAddress = useCallback(() => {
        if (!company)
            return '';
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
                let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
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
                }
                else {
                    setCenter(DEFAULT_CENTER);
                    toast({
                        title: "Aviso",
                        description: "Usando localização padrão pois não foi possível encontrar o endereço",
                        status: "warning",
                        duration: 5000,
                        isClosable: true
                    });
                }
            }
            catch (err) {
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
            }
            finally {
                setIsLoading(false);
            }
        };
        const timeoutId = setTimeout(() => {
            geocodeAddress();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [apiKey, company?.address, company?.city, company?.state_id, company?.latitude, company?.longitude, fullAddress, latitude, longitude, onMapClick, toast, states]);
    const handleMapClick = useCallback((e) => {
        if (!e.latLng || !onMapClick)
            return;
        const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setCenter(newPosition);
        onMapClick(newPosition.lat, newPosition.lng);
    }, [onMapClick]);
    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);
    return (_jsxs(Box, { h: height, position: "relative", children: [error && (_jsx(Center, { h: "full", children: _jsx(Text, { color: "red.500", children: error }) })), isLoading && (_jsx(Center, { h: "full", position: "absolute", top: "0", left: "0", right: "0", bottom: "0", bg: "whiteAlpha.800", zIndex: 1, children: _jsx(Spinner, { size: "xl" }) })), isLoaded && !loadError ? (_jsx(GoogleMapComponent, { mapContainerStyle: { width: '100%', height: '100%' }, zoom: DEFAULT_ZOOM, center: center, options: {
                    ...mapOptions,
                    styles: colorMode === 'dark' ? darkModeStyle : undefined
                }, onClick: handleMapClick, onLoad: onLoad, onUnmount: onUnmount, children: _jsx(MarkerF, { position: center, draggable: true, onDragEnd: (e) => {
                        if (e.latLng && onMapClick) {
                            const newPosition = {
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng()
                            };
                            setCenter(newPosition);
                            onMapClick(newPosition.lat, newPosition.lng);
                        }
                    } }) })) : (_jsx(Center, { h: "full", children: _jsx(Text, { color: "red.500", children: loadError ? 'Erro ao carregar o Google Maps' : 'Carregando...' }) }))] }));
}
