import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  Text as SvgText,
} from 'react-native-svg';
import React, {PureComponent} from 'react';

const chartSize = 300;
const numberOfScales = 5;

export default class RadarChart extends React.Component {
  
  state = {
    history: [],
    historyLine: [],
    groups: [],
    scale: [],
    middleOfChart: (chartSize / 2).toFixed(4),
  };
  componentWillReceiveProps() {
    let history = this.state.history;
    let historyLine = [];
    if(history.length > 20){
      history.shift();
    }
    history.push([this.props.xPos, this.props.yPos]);
    this.setState({history});
    for(i = 0; i < history.length; i++){
      historyLine.push(this.historyDot(history[i][0], history[i][1], i));
    }
    this.setState({historyLine: [<G>{historyLine}</G>]});
  }
  componentDidMount() {
    this.preRender();
  }
  scale = value => (
    <Circle
      key={`scale-${value}`}
      cx={0}
      cy={0}
      r={((value / numberOfScales) * chartSize) / 2}
      fill="#FFFFFF"
      stroke="#999"
      strokeWidth="0.8"
    />
  );
  historyDot = (x, y, i) => (
    <Circle
      key={`scale-${x}${y}${i}`}
      cx={x}
      cy={y}
      r={3}
      fill="#FFFFFF"
      stroke="#999"
      strokeWidth="0.8"
    />
  );
  preRender() {
    scales = [];
    groups = [];
    for (let i = numberOfScales; i > 0; i--) {
      scales.push(this.scale(i));
    }
    groups.push(<G key={`scales`}>{scales}</G>);
    this.setState({scales, groups});
  }
  render() {
    return (
      <Svg
        width={chartSize}
        height={chartSize}
        viewBox={`0 0 ${chartSize} ${chartSize}`}>
        <G
          transform={`translate(${this.state.middleOfChart}, ${this.state.middleOfChart})`}>
          {this.state.groups}
        </G>
        <G>{this.state.historyLine}</G>
        <Line
          x1="0"
          y1="150"
          x2="300"
          y2="150"
          fill="#FFFFFF"
          stroke="#999"
          strokeWidth="0.8"
        />
        <Line
          x1="150"
          y1="0"
          x2="150"
          y2="300"
          fill="#FFFFFF"
          stroke="#999"
          strokeWidth="0.8"
        />
        <SvgText
          x="180"
          y="160"
          font-family="sans-serif"
          font-size="20px"
          fill="black">
          20%
        </SvgText>
        <SvgText
          x="210"
          y="160"
          font-family="sans-serif"
          font-size="20px"
          fill="black">
          40%
        </SvgText>
        <SvgText
          x="240"
          y="160"
          font-family="sans-serif"
          font-size="20px"
          fill="black">
          60%
        </SvgText>
        <SvgText
          x="270"
          y="160"
          font-family="sans-serif"
          font-size="20px"
          fill="black">
          80%
        </SvgText>
        <Circle
          cx={this.props.xPos}
          cy={this.props.yPos}
          r="7.5"
          stroke="green"
          stroke-width="4"
          fill="yellow"
        />
      </Svg>
    );
  }
}