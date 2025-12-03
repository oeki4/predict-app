import { Flex,Text, Card } from "@shared/ui";

export default function CorporationPage() {
  return (
  <Flex direction="column" items="center" gap={12}>
    <Text size={24} align="center">Информация</Text>
    <Card>
      <Flex direction="column" gap={8}>
        <Text size={14}>Разработали студенты группы бИЦ-222:</Text>
        <Text size={14}>Обучние модели: Летников Д.М.</Text>
        <Text size={14}>Разработка Backend-части приложения: Акимов Н.В.</Text>
        <Text size={14}>Разработка Frontend-части приложения: Хрячков Н.В.</Text>
      </Flex>
    </Card>
    
  </Flex>);
}
