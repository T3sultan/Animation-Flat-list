
import React, { useState, useEffect } from 'react';
import {StyleSheet,View,Text,ActivityIndicator,Image,Animated,FlatList} from 'react-native';

const BIG_IMG = 'https://cdn.pixabay.com/photo/2020/01/31/07/53/man-4807395_960_720.jpg';
const ITEM_MARGIN_BOTTOM = 20;
const ITEM_PADDING = 10;
const HEIGHT_IMG = 100;
const ITEM_SIZE = HEIGHT_IMG + ITEM_PADDING * 2 + ITEM_MARGIN_BOTTOM;

const App = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [data, setdata] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getListPhotos();
    return () => {

    }
  }, [])

  getListPhotos = () => {
    const apiURL = 'https://jsonplaceholder.typicode.com/photos';
    fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        setdata(resJson)
      }).catch((error) => {
        console.log("Request Api Error", error);
      }).finally(() => setisLoading(false));

  }

  renderItem = ({ item, index }) => {
    const scale = scrollY.interpolate({
      inputRange: [
        -1, 0,
        ITEM_SIZE * index,
        ITEM_SIZE * (index + 2)
      ],
      outputRange: [1, 1, 1, 0]
    })
    const opacity = scrollY.interpolate({
      inputRange: [
        -1, 0,
        ITEM_SIZE * index,
        ITEM_SIZE * (index + .6)
      ],
      outputRange: [1, 1, 1, 0]
    })
    return (
      <Animated.View style={[
        styles.item,
        {
          transform: [{scale}],
          opacity
        }
      ]}>
        <Image
          style={styles.image}
          source={{ uri: item.url }}
          resizeMode="contain"

        />
        <View style={styles.wrapText}>
          <Text style={styles.fontSize}>{index + '. ' + item.title}</Text>

        </View>

      </Animated.View>
    )

  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BIG_IMG }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={70}
      />
      {isLoading ? <ActivityIndicator /> : (
        <Animated.FlatList
          data={data}
          keyExtractor={item => `key-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 20
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffSet: {y: scrollY } } }],
            { useNativeDriver: true }

          )}
        />

      )}

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  fontSize: {
    fontSize: 18,

  },
  image: {
    width: 100,
    height: HEIGHT_IMG,
  },
  wrapText: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center"
  },
  item: {
    flexDirection: 'row',
    marginBottom: ITEM_MARGIN_BOTTOM,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: .3,
    shadowRadius: 20,
    padding: ITEM_PADDING,
  }

});
export default App;
