import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Svg, { Defs, Rect, Mask } from 'react-native-svg';

const MaskSvg = () => {
  const { height, width } = Dimensions.get('window');
  const circleRadius = width / 2.5;
  const viewBox = `0 0 ${width} ${height}`
  return (
    <View aspectRatio={1}>
      <Svg
        height={height}
        viewBox={viewBox}
      >
        <Defs>
          <Mask id="mask">
            <Rect height={height} width={width} fill="#DCDCDC" />
            <Rect
                x="30"
                y="125"
                width={width-60}
                height={height-250}
                fill="#000"
            />
          </Mask>
        </Defs>

        <Rect
          height={height}
          width={width}
          fill="#ffffff"
          fillOpacity={0.5}
          mask="url(#mask)"
        />
      </Svg>
    </View>
  );
};

export default MaskSvg;