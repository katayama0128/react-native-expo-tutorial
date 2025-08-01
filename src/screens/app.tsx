import { type FC, useState, useRef } from "react";
import { StyleSheet, View, type ImageSourcePropType } from "react-native";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from "react-native-view-shot";

import { Button } from "@/components/button";
import { ImageViewer } from "@/components/image-viewer";
import { IconButton } from "@/components/icon-button";
import { CircleButton } from "@/components/circle-button";
import { EmojiPicker } from "@/components/emoji-picker";
import { EmojiList } from "@/components/emoji-list";
import { EmojiSticker } from "@/components/emoji-sticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlaceholderImage =
  require("@/assets/images/background-image.png") as ImageSourcePropType;

const App: FC = () => {
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | null>(
   null,
  );
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  if (status === null) {
    void requestPermission();
  }

  const onModalClose = () => {
   setIsModalVisible(false);
 };

  const onReset = () => {
   setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("保存しました!");
      }
    } catch (e) {
      console.log(e);
    }
  };


  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("画像が選択されていません");
    }
  };

  //setShowAppOptions(true);
  console.log(showAppOptions);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && (
         <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
       )}
      </View>
      </View>
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="リセット" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="保存"
                onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
      <View style={styles.footerContainer}>
        <Button theme="primary" label="写真を選択" onPress={pickImageAsync} />
        { /* <Button label="この写真を使用" /> */ }
        <Button label="この写真を使用" onPress={() => setShowAppOptions(true)} />
      </View>
      )}
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
   position: "absolute",
   bottom: 80,
 },
 optionsRow: {
   alignItems: "center",
   flexDirection: "row",
 },
});

registerRootComponent(App);
