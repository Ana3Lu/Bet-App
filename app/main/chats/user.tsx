import React, { useState } from "react";
import { Text, View } from "react-native";


interface Message {
    chatId: string, // UUID FK chatroom id
    text: string,
    sender: string,  // UUID FK profile id
    media?: {
        type: 'image' | 'video',
        url: string
    },
    createdAt: Date,
    editedAt: Date | null,
    deletedAt: Date | null,
    seenAt: Date | null,
    sendAt: Date | null
}

interface Chat {
    id: string, // UUID FK profile id
    userId: string, // UUID FK profile id
    userId2: string, // UUID FK profile id
    messages: Message[]
}

export default function Users() {

    const [users, setUsers] = useState([]);

    // enviar un mensaje de nosotros

    return (
        <View>
            <Text>Users</Text>
        </View>
    );
}
