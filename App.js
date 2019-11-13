/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';
import {extractDataFromHex} from './Base64Reader';
import RadarChart from './radarChart';

const service = '0000FFE0-0000-1000-8000-00805F9B34FB';
const characteristicN = '0000FFE1-0000-1000-8000-00805F9B34FB';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends PureComponent {
  state = {
    devices: [],
    selDevice: null,
    detail: [0, 0, 0, 0, 0],
    xPos: 0,
    yPos: 0,
    stage: 0,
  };
  value = null;
  notiEvent = null;
  toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  }
  notificationProcess() {
    setTimeout(() => {
      this.readNoti();
    }, 150);
    setTimeout(() => {
      this.stopReadNoti();
    }, 100);
  }
  toDecimalArray(byteArray) {
    let dec = [];
    for (let i = 0; i < byteArray.length - 1; i += 2) {
      dec.push(byteArray[i] * 255 + byteArray[i + 1]);
    }
    return dec;
  }
  readNoti() {
    console.log('read');
    this.notiEvent = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        // Convert bytes array to string
        //const data = this.toHexString(value);
        if (value) this.setState({detail: value});
        // this.value = value;
        // console.log('read')
      },
    );
  }
  stopReadNoti() {
    if (this.notiEvent) {
      this.notiEvent.remove();
    }
  }
  async connectAndPrepare(peripheral, service, characteristic) {
    // Connect to device
    await BleManager.connect(peripheral);
    // Before startNotification you need to call retrieveServices
    await BleManager.retrieveServices(peripheral);
    // To enable BleManagerDidUpdateValueForCharacteristic listener
    await BleManager.startNotification(peripheral, service, characteristic);
    // Add event listener
    this.notiEvent = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        // Convert bytes array to string
        // const data = this.toHexString(value);
        // this.setState({detail: value});
        // this.value = value;
        // console.log('read')
        // const _value = this.toDecimalArray(value);
        // this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        let time = new Date().getMilliseconds();
        //#region time case
        if (time > 0 && time <= 200 && this.state.stage === 0) {
          this.setState({stage: 1});
          console.log(this.state.stage + ' ' + time);
          const _value = this.toDecimalArray(value);
          this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        } else if (time > 200 && time <= 400 && this.state.stage === 1) {
          this.setState({stage: 2});
          console.log(this.state.stage + ' ' + time);
          const _value = this.toDecimalArray(value);
          this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        } else if (time > 400 && time <= 600 && this.state.stage === 2) {
          this.setState({stage: 3});
          console.log(this.state.stage + ' ' + time);
          const _value = this.toDecimalArray(value);
          this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        } else if (time > 600 && time <= 800 && this.state.stage === 3) {
          this.setState({stage: 4});
          console.log(this.state.stage + ' ' + time);
          const _value = this.toDecimalArray(value);
          this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        } else if (time > 800 && this.state.stage === 4) {
          this.setState({stage: 0});
          console.log(this.state.stage + ' ' + time);
          const _value = this.toDecimalArray(value);
          this.setState({xPos: ((_value[2] - _value[1]) / 650) * 150 + 150, yPos: (((_value[0] + _value[1] + _value[2]) / 3 - _value[4]) / -650) * 150 + 150});
        }
        //#endregion
        
      },
    );
    // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
    // setInterval(() => {
    //   this.notificationProcess();
    // }, 260);
    return;
  }
  componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch(error => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });
    BleManager.start({showAlert: false}).then(() => {
      console.log('start BLE');
    });
  }
  render() {
    // console.log(extractDataFromHex(this.toHexString(this.state.detail)));
    return (
      <View>
        <Button
          title={'scan'}
          onPress={() => {
            BleManager.scan([], 5, true).then(() => {
              console.log('scan');
            });
          }}
        />
        <Button
          title={'stop scan'}
          onPress={() => {
            BleManager.stopScan().then(() => {
              console.log('stop scan');
            });
          }}
        />
        <Button
          title={'view device'}
          onPress={() => {
            BleManager.getDiscoveredPeripherals().then(devices => {
              this.setState({devices});
              // console.log(devices);
            });
          }}
        />
        {!this.state.selDevice ? (
          this.state.devices.map((v, i) => (
            <Button
              key={v.id}
              title={v.name + ''}
              onPress={() => {
                this.setState({selDevice: v});
              }}
            />
          ))
        ) : (
          <View>
            <Button
              title={'read noti'}
              onPress={() => {
                this.connectAndPrepare(
                  this.state.selDevice.id,
                  service,
                  characteristicN,
                );
              }}
            />
            <Button
              title={'disconnect'}
              onPress={() => {
                this.stopReadNoti();
                BleManager.disconnect(this.state.selDevice.id).then(() => {
                  console.log('disconnect');
                });
                this.setState({selDevice: null});
              }}
            />
            <RadarChart xPos={this.state.xPos} yPos={this.state.yPos} />
          </View>
        )}
      </View>
    );
  }
}
