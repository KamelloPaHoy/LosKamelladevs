import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useTrabajos } from "@/hooks/useTrabajos";

export default function Inicio() {
  const { trabajos, cargando, error } = useTrabajos();

  if (cargando) return <ActivityIndicator style={{ marginTop: 60 }} />;
  if (error) return <Text style={{ margin: 24 }}>{error}</Text>;
  if (trabajos.length === 0)
    return <Text style={{ margin: 24 }}>Todavía no hay trabajos publicados.</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={trabajos}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Text>{item.titulo} - ${item.precio}</Text>
        )}
      />
    </View>
  );
}