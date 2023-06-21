import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Slider from '@react-native-community/slider';
import {horizontalScale, moderateScale, verticalScale} from '../styles/mixins';
import axios from 'axios';

const CalculateEarnings = () => {
  const [amount, setAmount] = useState(7000);
  const [year, setYear] = useState(3);
  const [select, setSelect] = useState('USDT');

  const [timeline, setTimeline] = useState(1);
  const [invested, setInvested] = useState(false);
  const [type, setType] = useState('Grayscale Bitcoin Trust');
  const [list, setList] = useState();
  // const [poolDetails, setPoolDetails] = useState();
  const [poolId, setPoolId] = useState();

  const baseUrl = 'https://api.nordl.io/';

  const AmountArr = ['0', '3K', '6K', '12K', '15K', '18K', '21K'];
  const YearArr = ['10 yrs', '8 yrs', '6 yrs', '4 yrs', '2 yrs', 'Present'];
  const [result, setResult] = useState();

  function nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }

  const allPool = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const {data} = await axios({
        method: 'GET',
        url: '/api/product/all-pools',
        baseURL: baseUrl,
        headers,
      });
      console.log('69', data?.data);
      setList(data?.data?.pools);
    } catch (err) {
      console.log(err);
    }
  };

  const _poolDetails = async id => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const {data} = await axios({
        method: 'GET',
        url: '/api/product/calculator-details/' + id,
        baseURL: baseUrl,
        headers,
      });
      console.log('54', data.data);
      // setPoolDetails(data.data);
      setYear(data.data.yearlyOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const investCount = (timeline, year) => {
    let invest = 0;
    switch (timeline) {
      case 1:
        invest = year * 12;
        break;
      case 2:
        invest = year * 365;
        break;
      case 3:
        invest = year * 1;
        break;
    }
    return invest;
  };

  const poolCalculator = async () => {
    if (!poolId) {
      ToastAndroid.show('Select pool', ToastAndroid.SHORT);
      return;
    }
    if (!timeline) {
      ToastAndroid.show('Select timeline', ToastAndroid.SHORT);
      return;
    }
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const body = {
        poolId: poolId,
        frqInDays:
          timeline == 1 ? 30 : timeline == 2 ? 1 : timeline == 3 ? 365 : 0,
        investmentCount: investCount(timeline, year),
        sipAmount: amount,
      };
      const data = await axios({
        method: 'POST',
        url: '/api/product/calculator-for-pool',
        baseURL: baseUrl,
        headers,
        data: body,
      });
      console.log('192', data);
      setResult(data?.data?.data?.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    allPool();
  }, []);

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        {/* Top Header */}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{height: moderateScale(32), width: moderateScale(32)}} />

          <Text style={styles.headers}>Calculate Earnings</Text>

          <TouchableOpacity style={styles.crossbtn}>
            <Image
              source={require('../assets/icons/CrossIcon.png')}
              style={{
                height: moderateScale(30),
                width: moderateScale(30),
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Amount slider */}
        <View
          style={{
            marginTop: verticalScale(21),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: horizontalScale(15),
          }}>
          <Text style={styles.textHead}>Invested Amount</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <TextInput
                value={amount.toString()}
                onChangeText={text => setAmount(text)}
                keyboardType="number-pad"
                style={{
                  backgroundColor: '#F3F3F3',
                  padding: 0,
                  height: moderateScale(23),
                  paddingHorizontal: horizontalScale(12),
                  borderRadius: moderateScale(12),
                  minWidth: horizontalScale(70),
                  fontSize: moderateScale(11),
                  color: '#252A48',
                  fontFamily: 'DMSans-Medium',
                  textAlign: 'center',
                  marginRight: horizontalScale(8),
                }}
              />
              {/* <Text>{amount}</Text> */}
            </View>
            <TouchableOpacity
              style={{
                width: horizontalScale(70),
                height: moderateScale(23),
                backgroundColor: '#F3F3F3',
                borderRadius: moderateScale(11.5),
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: horizontalScale(12),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: 'DMSans-Medium',
                  fontSize: moderateScale(11),
                  color: '#252A48',
                }}>
                {select}
              </Text>
              <Image
                source={require('../assets/icons/DownArrow.png')}
                style={{
                  height: moderateScale(3),
                  width: moderateScale(6),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Slider
          value={parseInt(amount) || 0}
          onValueChange={valueData => setAmount(parseInt(valueData, 10))}
          thumbTintColor="#304FFE"
          minimumTrackTintColor="#304FFE"
          maximumTrackTintColor="#9EACDB"
          minimumValue={0}
          maximumValue={21000}
          style={{marginVertical: moderateScale(8)}}
        />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
          }}>
          <FlatList
            data={AmountArr}
            contentContainerStyle={{justifyContent: 'space-between'}}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <Text
                  style={{
                    marginRight:
                      AmountArr.length - 1 == index
                        ? horizontalScale(0)
                        : horizontalScale(34),
                    fontFamily: 'DMSans-Medium',
                    fontSize: moderateScale(14),
                    color: '#000000',
                  }}>
                  {nFormatter(21000 * (index / 7))}
                </Text>
              );
            }}
          />
        </View>
        {/* Invested In  */}
        <View style={styles.dropMain}>
          <Text style={styles.textHead}>Invested In</Text>

          <View style={{width: '70%'}}>
            <TouchableOpacity
              onPress={() => setInvested(!invested)}
              style={{
                height: moderateScale(23),
                backgroundColor: '#F3F3F3',
                borderRadius: moderateScale(11.5),
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: horizontalScale(12),
                justifyContent: 'space-between',
                width: '90%',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../assets/icons/Icon.png')}
                  style={{
                    height: moderateScale(30),
                    width: moderateScale(30),
                    resizeMode: 'contain',
                    marginTop: moderateScale(5),
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'DMSans-Medium',
                    fontSize: moderateScale(11),
                    color: '#252A48',
                  }}>
                  {type}
                </Text>
              </View>

              <Image
                source={require('../assets/icons/DownArrow.png')}
                style={{
                  height: moderateScale(3),
                  width: moderateScale(6),
                  transform: [{rotate: invested ? '180deg' : '0deg'}],
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                display: invested ? 'flex' : 'none',
                position: 'absolute',
                marginTop: moderateScale(30),
                backgroundColor: '#F3F3F3',
                borderRadius: moderateScale(11.5),
                paddingHorizontal: horizontalScale(12),
                width: '90%',
                alignItems: 'center',
              }}>
              <FlatList
                data={list}
                contentContainerStyle={{justifyContent: 'space-between'}}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setType(item.poolName),
                          setInvested(!invested),
                          setPoolId(item.id);
                        _poolDetails(item.id);
                      }}>
                      <Text style={styles.poolName}>{item.poolName}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
        {/*Invested In Timeline */}
        <View
          style={{
            marginTop: moderateScale(30),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: horizontalScale(15),
          }}>
          <Text style={styles.textHead}>Investment Timeline</Text>
        </View>
        <View style={styles.timeline}>
          <TouchableOpacity
            onPress={() => setTimeline(1)}
            style={{
              width: horizontalScale(90),
              height: moderateScale(30),
              backgroundColor: timeline == 1 ? '#304FFE' : '#F3F3F3',
              borderRadius: moderateScale(15),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'DMSans-Medium',
                fontSize: moderateScale(11),
                color: timeline == 1 ? '#fff' : '#252A4880',
              }}>
              Every Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeline(2)}
            style={{
              width: horizontalScale(90),
              height: moderateScale(30),
              backgroundColor: timeline == 2 ? '#304FFE' : '#F3F3F3',
              borderRadius: moderateScale(15),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'DMSans-Medium',
                fontSize: moderateScale(11),
                color: timeline == 2 ? '#fff' : '#252A4880',
              }}>
              Every Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeline(3)}
            style={{
              width: horizontalScale(90),
              height: moderateScale(30),
              backgroundColor: timeline == 3 ? '#304FFE' : '#F3F3F3',
              borderRadius: moderateScale(15),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'DMSans-Medium',
                fontSize: moderateScale(11),
                color: timeline == 3 ? '#fff' : '#252A4880',
              }}>
              Every Year
            </Text>
          </TouchableOpacity>
        </View>
        {/* Year slider */}
        <View
          style={{
            marginTop: moderateScale(30),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: horizontalScale(15),
          }}>
          <Text style={styles.textHead}>Invested From</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: horizontalScale(70),
                height: moderateScale(23),
                backgroundColor: '#F3F3F3',
                borderRadius: moderateScale(11.5),
                justifyContent: 'center',
              }}>
              <Text style={styles.blktext}>{year} yrs</Text>
            </View>
          </View>
        </View>
        <Slider
          value={year}
          onValueChange={valueData => setYear(parseInt(valueData, 10))}
          thumbTintColor="#304FFE"
          minimumTrackTintColor="#304FFE"
          maximumTrackTintColor="#9EACDB"
          minimumValue={10}
          maximumValue={1}
          style={{marginVertical: moderateScale(8)}}
        />
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
          }}>
          <FlatList
            data={YearArr}
            contentContainerStyle={{justifyContent: 'space-between'}}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <Text
                  style={{
                    marginRight:
                      index == YearArr.length - 2
                        ? horizontalScale(10)
                        : index == YearArr.length - 1
                        ? horizontalScale(0)
                        : index == 0
                        ? moderateScale(12)
                        : horizontalScale(35),
                    fontFamily: 'DMSans-Medium',
                    fontSize: moderateScale(14),
                    color: '#000000',
                  }}>
                  {item}
                </Text>
              );
            }}
          />
        </View>
        {/* Result Section */}
        <View
          style={{
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: moderateScale(45),
          }}>
          <Text
            style={{
              fontFamily: 'DMSans-Medium',
              fontSize: moderateScale(14),
              color: '#9EACDB',
              width: '55%',
            }}>
            Invested Money
          </Text>
          <Text
            style={{
              fontFamily: 'DMSans-Bold',
              fontSize: moderateScale(16),
              color: '#9EACDB',
              width: '45%',
            }}>
            {result
              ? parseFloat(result?.resultData.at(-1).investedAmount).toFixed(2)
              : '0.00'}
            USDT
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: moderateScale(7),
          }}>
          <Text
            style={{
              fontFamily: 'DMSans-Medium',
              fontSize: moderateScale(14),
              color: '#9EACDB',
              width: '53%',
            }}>
            Money you would have
          </Text>
          <Text
            style={{
              fontFamily: 'DMSans-Bold',
              fontSize: moderateScale(16),
              color: '#2BA24C',
              width: '47%',
            }}>
            {result
              ? parseFloat(result?.resultData.at(-1).worthNowInUSD).toFixed(2)
              : '0.00'}{' '}
            USDT
          </Text>
        </View>
        {result?.absoluteReturns >= 0 ? (
          <View
            style={{
              height: moderateScale(18),
              width: horizontalScale(70),
              borderRadius: moderateScale(5),
              backgroundColor: '#00DD9A20',
              marginLeft: '53%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: horizontalScale(4),
            }}>
            <Image
              source={require('../assets/icons/uparrow.png')}
              style={{
                height: moderateScale(10),
                width: moderateScale(10),
                resizeMode: 'contain',
              }}
            />
            <Text style={[styles.percentTxt, {color: '#2BA24C'}]}>
              {result.absoluteReturns
                ? parseFloat(result.absoluteReturns).toFixed(2)
                : 0}
              %
            </Text>
          </View>
        ) : (
          <View
            style={{
              height: moderateScale(18),
              width: horizontalScale(70),
              borderRadius: moderateScale(5),
              backgroundColor: '#f0000920',
              marginLeft: '53%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: horizontalScale(4),
            }}>
            <Image
              source={require('../assets/icons/uparrow.png')}
              style={{
                height: moderateScale(10),
                width: moderateScale(10),
                resizeMode: 'contain',
                tintColor: 'red',
                transform: [
                  {
                    rotate: '180deg',
                  },
                ],
              }}
            />
            <Text style={[styles.percentTxt, {color: 'red'}]}>
              {result?.absoluteReturns
                ? parseFloat(result.absoluteReturns).toFixed(2)
                : 0}
              %
            </Text>
          </View>
        )}
        {/* Button */}
        <TouchableOpacity style={styles.btn} onPress={poolCalculator}>
          <Text style={styles.btntext}>Calculate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalculateEarnings;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(30),
    padding: moderateScale(13),
    width: '95%',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10,
  },
  headers: {
    fontFamily: 'DMSans-Bold',
    fontSize: moderateScale(20),
    color: '#252A48',
    marginTop: verticalScale(25),
  },
  crossbtn: {
    height: moderateScale(32),
    width: moderateScale(32),
    backgroundColor: '#304FFE',
    borderRadius: moderateScale(32 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHead: {
    fontFamily: 'DMSans-Medium',
    fontSize: moderateScale(14),
    color: '#9EACDB',
  },
  dropMain: {
    marginTop: moderateScale(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: horizontalScale(15),
    width: '100%',
    zIndex: 9999,
  },
  poolName: {
    fontFamily: 'DMSans-Medium',
    fontSize: moderateScale(14),
    color: '#000000',
    marginVertical: moderateScale(8),
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: horizontalScale(35),
    justifyContent: 'space-between',
  },
  blktext: {
    fontFamily: 'DMSans-Medium',
    fontSize: moderateScale(11),
    color: '#252A48',
    marginLeft: horizontalScale(12),
  },
  percentTxt: {
    fontFamily: 'DMSans-Medium',
    fontSize: moderateScale(12),
    paddingHorizontal: 2,
  },
  btn: {
    backgroundColor: '#304FFE',
    height: moderateScale(50),
    width: horizontalScale(145),
    borderRadius: moderateScale(7),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(40),
    marginBottom: moderateScale(24),
  },
  btntext: {
    fontFamily: 'DMSans-Medium',
    fontSize: moderateScale(14),
    color: '#fff',
  },
});
