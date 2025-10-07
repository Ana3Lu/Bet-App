import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Review {
  id: string;
  comment: string;
  created_at: string;
  user_id: {
    id: string;
    name: string;
  };
}

interface ReviewModalProps {
  betId: string;
  isVisible: boolean;
  onClose: () => void;
  onReviewAdded: () => void;
}

export default function ReviewModal({
  betId,
  isVisible,
  onClose,
  onReviewAdded,
}: ReviewModalProps) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
        .from("reviews")
        .select("id, comment, created_at, user_id(id,name)")
        .eq("bet_id", betId)
        .order("created_at", { ascending: false });

    if (!error && data) {
        const formatted = data.map((r: any) => ({
        ...r,
        user_id: Array.isArray(r.user_id) ? r.user_id[0] : r.user_id,
        }));
        setReviews(formatted);
    }
    }, [betId]);

  useEffect(() => {
    if (isVisible) fetchReviews();
  }, [isVisible, fetchReviews]);

  const handleAddReview = async () => {
    if (!newComment.trim() || !user?.id) return;

    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      bet_id: betId,
      user_id: user.id,
      comment: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      onReviewAdded();
      fetchReviews();
    }
    setLoading(false);
  };

  return (
    <Modal animationType="slide" visible={isVisible} transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>💬 Reviews</Text>

          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.username}>{item.user_id?.name || "Anon"}</Text>
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.time}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No reviews yet.</Text>}
          />

          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#ccc"
            value={newComment}
            onChangeText={setNewComment}
          />

          <TouchableOpacity
            onPress={handleAddReview}
            style={[styles.button, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <LinearGradient
              colors={["#0d9c5cff", "#293badff"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Post</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    height: "80%",
    backgroundColor: "#1b266bff",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reviewCard: {
    backgroundColor: "#2c2f7c",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  username: { color: "#0d9c5cff", fontWeight: "bold" },
  comment: { color: "#fff" },
  time: { color: "#ccc", fontSize: 12, textAlign: "right" },
  input: {
    backgroundColor: "#2c2f7c",
    borderRadius: 20,
    padding: 12,
    color: "#fff",
    marginVertical: 10,
  },
  button: { alignSelf: "center", width: "50%" },
  buttonGradient: {
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  empty: {
    color: "#ccc",
    textAlign: "center",
    marginVertical: 15,
  },
});
