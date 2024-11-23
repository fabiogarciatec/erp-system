import { useState } from 'react'
import {
  Box,
  Image,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { supabase } from '../services/supabase'

export default function ImageUpload({ currentImage, onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0]
      if (!file) return

      setIsUploading(true)

      // Criar um nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `product-images/${fileName}`

      // Upload do arquivo para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Gerar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)

      toast({
        title: 'Imagem enviada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao enviar imagem',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FormControl>
      <FormLabel>Imagem do Produto</FormLabel>
      <VStack spacing={4} align="start">
        {currentImage && (
          <Box boxSize="150px">
            <Image
              src={currentImage}
              alt="Imagem do produto"
              objectFit="cover"
              w="100%"
              h="100%"
              borderRadius="md"
            />
          </Box>
        )}
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <Button
            as="label"
            htmlFor="image-upload"
            colorScheme="blue"
            isLoading={isUploading}
            cursor="pointer"
          >
            {currentImage ? 'Trocar Imagem' : 'Enviar Imagem'}
          </Button>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
          </Text>
        </Box>
      </VStack>
    </FormControl>
  )
}
