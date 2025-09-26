import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useRef, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PreviewProps {
    base64: string,
    uri: string
}

interface CameraModalProps {
    isVisible: boolean,
    onConfirm: (url: string) => void,
    onCancel: () => void
}

export default function CameraModal({
    isVisible,
    onConfirm,
    onCancel
}: CameraModalProps) {

    const { user } = useContext(AuthContext);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [preview, setPreview] = useState<PreviewProps | null>(null);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "white" }}>We need camera permission</Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Text style={{ color: "cyan" }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleTake = async () => {
        try {
            const response = await cameraRef.current?.takePictureAsync({
                quality: 0.5,
                base64: true
            });

            if (response?.uri && response?.base64) {
                setPreview({
                    uri: response.uri,
                    base64: response.base64
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true
        });

        if (!result.canceled && result.assets[0].uri && result.assets[0].base64) {
            setPreview({
                uri: result.assets[0].uri,
                base64: result.assets[0].base64
            });
        }
    };

    const handleSaveImageBucket = async () => {
        try {
            if (!user || !preview) {
                console.log("⚠️ No user or no preview image selected to upload");
                return;
            }

            const folder = `${user.id}/`;
            const filename = `${Date.now()}.jpg`;
            const relativePath = `${folder}${filename}`;

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .upload(`${relativePath}`,
                    decode(preview.base64), {
                    contentType: 'image/jpg'
                })

            console.log(">>> Storage upload:", { data });

            if (!error && data?.fullPath) {
                const { data: publicData } = await supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(relativePath);

                if (publicData?.publicUrl) {
                    onConfirm(publicData.publicUrl);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal animationType="slide" visible={isVisible}>
        {permission?.granted ? (
            <View style={styles.container}>
            {preview ? (
                <>  
                    {/* Fondo */}
                    <View style={styles.previewBackground}>
                        <LinearGradient
                        colors={["#0d9c5cff", "#293badff"]}
                            start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1}}
                        />
                    </View>
                    <Text style={styles.previewTitle}>Preview</Text>
                    <Image source={{ uri: preview.uri }} style={styles.previewImage} />     
                    <View style={styles.previewButtons}>
                        <TouchableOpacity onPress={() => setPreview(null)} style={styles.iconButton}>
                            <Ionicons name="refresh-circle" size={80} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSaveImageBucket} style={styles.iconButton}>
                            <Ionicons name="checkmark-circle" size={80} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel} style={styles.iconButton}>
                            <Ionicons name="close-circle" size={80} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                    onPress={() => setFacing(prev => (prev === "back" ? "front" : "back"))}
                    style={styles.iconButton}
                    >
                    <Ionicons name="camera-reverse" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleTake} style={styles.iconButton}>
                    <Ionicons name="radio-button-on" size={110} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
                    <Ionicons name="images-outline" size={35} color="white" />
                    </TouchableOpacity>
                </View>
                </>
            )}
            </View>
        ) : (
            <View style={styles.centered}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <TouchableOpacity onPress={requestPermission}>
                <Text style={{ color: "cyan", fontSize: 18 }}>Grant Permission</Text>
            </TouchableOpacity>
            </View>
        )}
        </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b266bff',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  previewTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    padding: 70,
    textAlign: 'center',
  },
  previewImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: '50%',
    borderWidth: 8,
    borderColor: 'white'
  },
  previewBackground: {
    position: "absolute",
    width: '100%',
    height: '100%'
  },
  decorShapeTopLeft: {
    top: 80,
    left: -40,
  },
  decorShapeBottomRight: {
    bottom: 30,
    right: -40,
  },
  previewButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});