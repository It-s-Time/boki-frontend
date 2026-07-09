import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS_NEW } from '@/shared/constants/colors';
import AddImage from '@/assets/icons/review/image-plus.svg';

const MAX_PHOTOS = 3;

export interface ReviewMemo {
  content: string;
  photos: string[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (memo: ReviewMemo) => void;
}

export default function ReviewMemoModal({ visible, onClose, onSubmit }: Props) {
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleAddPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotos((prev) =>
        [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS),
      );
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handleSubmit = () => {
    onSubmit({ content, photos });
    setContent('');
    setPhotos([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS_NEW.border} />
            </Pressable>
            <Text style={styles.title}>메모</Text>
            <Pressable style={styles.checkButton} onPress={handleSubmit}>
              <Ionicons
                name="checkmark"
                size={22}
                color={COLORS_NEW.background}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.input}
              value={content}
              onChangeText={setContent}
              placeholder="글쓰기 시작..."
              placeholderTextColor={COLORS_NEW.border}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.photoRow}>
            <Pressable
              style={[
                styles.addPhotoIcon,
                photos.length >= MAX_PHOTOS && styles.addPhotoIconDisabled,
              ]}
              onPress={handleAddPhoto}
              disabled={photos.length >= MAX_PHOTOS}
            >
              <MaterialCommunityIcons
                name="image-plus"
                size={24}
                color={COLORS_NEW.border}
              />
            </Pressable>

            {photos.length === 0 && (
              <Text style={styles.addPhotoText}>최대 3장 추가 가능</Text>
            )}

            {photos.map((uri) => (
              <View key={uri} style={styles.photoThumbWrap}>
                <Pressable onPress={() => setPreviewUri(uri)}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                </Pressable>
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => handleRemovePhoto(uri)}
                >
                  <Ionicons name="close" size={12} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>

      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}
      >
        <Pressable
          style={styles.previewBackdrop}
          onPress={() => setPreviewUri(null)}
        >
          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          <Pressable
            style={styles.previewClose}
            onPress={() => setPreviewUri(null)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 22,
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS_NEW.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    maxHeight: 500,
    marginBottom: 16,
  },
  input: {
    minHeight: 300,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    padding: 0,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addPhotoIcon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIconDisabled: {
    opacity: 0.5,
  },
  addPhotoText: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  photoThumbWrap: {
    position: 'relative',
  },
  photoThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS_NEW.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewClose: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
