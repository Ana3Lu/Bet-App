import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";

// Open image picker
export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    console.log(result.assets[0].uri);
    return result.assets[0].uri;
  } else {
    alert('You did not select any image.');
    return null;
  }
};

// Take photo
export const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};

// Upload avatar
export const uploadAvatar = async (uri: string, userId: string) => {
  try {
    // File extension
    const fileExt = uri.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Read file in base64
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
    const fileData = decode(base64);

    // Upload
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, fileData, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    // Obtain public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Error subiendo avatar:", err);
    return null;
  }
};