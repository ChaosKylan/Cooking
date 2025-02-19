import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#4caf50", // Aktive Tab-Farbe
                tabBarInactiveTintColor: "#888", // Inaktive Tab-Farbe
                tabBarStyle: {
                    backgroundColor: "#1e1e1e", // Hintergrundfarbe der Tab-Leiste
                    borderTopWidth: 0, // Entfernt den oberen Rand der Tab-Leiste
                },
                headerShown: false,
            }}
        >
            {/* <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            /> */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Essenplan",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="calendar" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: "Rezepte",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="book" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shoppingList"
                options={{
                    title: "Einkaufsliste",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="shopping-cart"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
