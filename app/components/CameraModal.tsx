import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    const [preview, setPreview] = useState(null as PreviewProps | null);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        return <View />;
    }

    const handleTake = async () => {
        try {
            const response = await cameraRef.current?.takePictureAsync({
                quality: 0.5,
                base64: true
            });

            if (response && response.uri && response.base64) {
                setPreview({
                    uri: response?.uri,
                    base64: response?.base64
                });
            }

        } catch (error) {
            console.log({
                error
            })
        }
    }

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true
        });

        console.log(result);

        if (!result.canceled) {
            setPreview({
                uri: result.assets[0].uri,
                base64: result.assets[0].base64!
            });
        }
    };

    const handleSaveImageBucket = async () => {
        try {
            const folder = user.id;
            const filename = Date.now()

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .upload(`${folder}${filename}.jpg`,
                    decode(preview!.base64), {
                    contentType: 'image/jpg'
                })

            if (!error) {
                onConfirm(data!.fullPath);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal
            animationType='slide'
            visible={isVisible}
        >
            {
                permission?.granted ?
                    <>
                        <View style={styles.container}>
                            {
                                preview ?
                                    <View>
                                        <Image
                                            source={{
                                                uri: preview.uri
                                            }}
                                            width={300}
                                            height={300}
                                        />
                                        <TouchableOpacity
                                            onPress={handleSaveImageBucket}
                                        >
                                            <Text>Save Image</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <CameraView
                                        ref={cameraRef}
                                        style={styles.camera}
                                        facing={facing}
                                    />}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    onPress={() => setFacing(prev => prev == "back" ? "front" : "back")}
                                >
                                    <Text>Flip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleTake}
                                >
                                    <Text>Take</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handlePickImage}
                                >
                                    <Text>Pick</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                    :
                    <View style={styles.container}>
                        <Text style={styles.message}>We need your permission to show the camera</Text>
                        <Button onPress={requestPermission} title="grant permission" />
                    </View>
            }
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});