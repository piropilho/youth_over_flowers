import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  Image,
  Modal,
} from 'react-native';


import { WebView } from 'react-native-webview';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const BACKEND_URL = 'http://192.168.35.200:8000';

const DEMO_LAT = 37.5043;
const DEMO_LNG = 127.1058;

const FALLBACK_SHOPS = [
  { name: '백제고분로 수산시장', desc: '신선한 해산물 전문', category: '시장', lat: 37.5057, lng: 127.1044 },
  { name: '송파 전통 밥상',     desc: '현지인이 즐겨찾는 한식', category: '식당', lat: 37.5031, lng: 127.1069 },
  { name: '석촌 로컬 카페',     desc: '분위기 좋은 골목 카페',  category: '카페', lat: 37.5050, lng: 127.1076 },
];

const CATEGORIES = [
  { key: 'all',  label: '근처',        color: '#FF6B35' },
  { key: '식당', label: '식당',        color: '#FF9500' },
  { key: '카페', label: '카페',        color: '#8B572A' },
  { key: '시장', label: '가까운 시장', color: '#34C759' },
  { key: '쇼핑', label: '쇼핑',        color: '#FF2D55' },
];

const CAT_COLOR = { '식당': '#FF9500', '카페': '#8B572A', '시장': '#34C759', '쇼핑': '#FF2D55' };

const REC_CATEGORIES = ['전통시장', '로컬 맛집', '전통있는 가게'];

const REC_SHOPS = [
  { id: 1, img: require('../../assets/fish.png'),  name: '가락시장 OO수산',       cat: '전통시장', desc: '이전에 검색하신 로컬 맛집 취향과 딱 맞아요', walk: 3  },
  { id: 2, img: require('../../assets/ramen.png'), name: '방이 시장 OO국수',      cat: '전통시장', desc: '로컬 맛집을 좋아하는 여행객에게 인기에요',   walk: 8  },
  { id: 3, img: require('../../assets/tteok.png'), name: '방이 시장 ㅁㅁ 떡볶이', cat: '전통시장', desc: '한국의 길거리 음식을 즐기기 딱이에요',      walk: 10 },
];

function buildMapHTML(lat, lng, shops) {
  const shopsJSON = JSON.stringify(shops);
  const catColorJSON = JSON.stringify(CAT_COLOR);
  // 절대 좌표 고정 — 백제고분로 인근 건물 밀집 구역
  const decoJSON = JSON.stringify([
    { lat: 37.5042, lng: 127.1028, t: 'cafe' },
    { lat: 37.5038, lng: 127.1045, t: 'restaurant' },
    { lat: 37.5048, lng: 127.1015, t: 'cafe' },
    { lat: 37.5035, lng: 127.1002, t: 'restaurant' },
    { lat: 37.5044, lng: 127.0958, t: 'cafe' },
    { lat: 37.5040, lng: 127.0975, t: 'restaurant' },
  ]);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body,#map{width:100%;height:100%}
  .mk{display:flex;flex-direction:column;align-items:center}
  .mk-c{width:26px;height:26px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
  .mk-t{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:8px;border-top-style:solid;margin-top:-1px}
  .my{width:16px;height:16px;border-radius:50%;background:#007AFF;border:3px solid #fff;box-shadow:0 0 0 4px rgba(0,122,255,0.2),0 2px 6px rgba(0,0,0,0.3)}
  .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:0}
  .leaflet-popup-content{margin:10px 14px;min-width:140px}
  .leaflet-popup-tip-container{display:none}
  .pop-n{font-size:13px;font-weight:700;color:#1A1A1A;margin-bottom:3px;font-family:sans-serif}
  .pop-d{font-size:11px;color:#757575;font-family:sans-serif}
</style>
</head>
<body>
<div id="map"></div>
<script>
var CAT_COLOR=${catColorJSON};
var shops=${shopsJSON};

var map=L.map('map',{center:[${lat},${lng}],zoom:16,zoomControl:false});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
  maxZoom:19,attribution:'© OpenStreetMap © CARTO',subdomains:'abcd'
}).addTo(map);

L.marker([${lat},${lng}],{
  icon:L.divIcon({html:'<div class="my"></div>',className:'',iconSize:[16,16],iconAnchor:[8,8]})
}).addTo(map);

shops.forEach(function(s){
  var c=CAT_COLOR[s.category]||'#999';
  var m=L.marker([s.lat,s.lng],{
    icon:L.divIcon({
      html:'<div class="mk"><div class="mk-c" style="background:'+c+'"></div><div class="mk-t" style="border-top-color:'+c+'"></div></div>',
      className:'',iconSize:[26,34],iconAnchor:[13,34]
    })
  }).addTo(map);
  m.bindPopup('<div class="pop-n">'+s.name+'</div><div class="pop-d">'+s.desc+'</div>',{closeButton:false});
});

var DECO=${decoJSON};
var DECO_COLOR={cafe:'#8B572A',restaurant:'#FF9500'};
DECO.forEach(function(d){
  var c=DECO_COLOR[d.t]||'#999';
  L.marker([d.lat,d.lng],{
    icon:L.divIcon({
      html:'<div class="mk"><div class="mk-c" style="background:'+c+'"></div><div class="mk-t" style="border-top-color:'+c+'"></div></div>',
      className:'',iconSize:[26,34],iconAnchor:[13,34]
    })
  }).addTo(map);
});
<\/script>
</body>
</html>`;
}

export default function MapScreen({ navigation }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [mapHTML, setMapHTML] = useState(null);
  const [showRecommend, setShowRecommend] = useState(false);
  const [recCategory, setRecCategory] = useState('전통시장');

  useEffect(() => {
    (async () => {
      let fetchedShops = [];
      try {
        const res = await fetch(`${BACKEND_URL}/map/nearby`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: DEMO_LAT, lng: DEMO_LNG }),
        });
        const data = await res.json();
        if (data.success) fetchedShops = data.shops;
      } catch (_) {}

      if (fetchedShops.length === 0) fetchedShops = FALLBACK_SHOPS;
      setShops(fetchedShops);
      setMapHTML(buildMapHTML(DEMO_LAT, DEMO_LNG, fetchedShops));
      setLoading(false);
    })();
  }, []);

  const filteredShops = shops.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch = !search.trim() || s.name.includes(search) || s.desc.includes(search);
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (shops.length === 0) return;
    setMapHTML(buildMapHTML(DEMO_LAT, DEMO_LNG, filteredShops));
  }, [category, search]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#05A68B" />
        <Text style={styles.loadingText}>주변 골목상권을 찾는 중...</Text>
      </View>
    );
  }

  const displayCount = category === 'all' ? shops.length : filteredShops.length;

  return (
    <View style={styles.container}>
      {mapHTML && (
        <WebView
          style={StyleSheet.absoluteFillObject}
          source={{ html: mapHTML }}
          originWhitelist={['*']}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
        />
      )}

      {/* 상단 플로팅 패널 — 지도 위에 절대 위치 */}
      <SafeAreaView style={styles.topSafe}>
        <View style={styles.topPanel}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M15 18l-6-6 6-6" stroke={COLORS.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>골목상권 지도</Text>
            <View style={styles.headerIconBtn} />
          </View>

          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="석촌동, 상점 이름으로 검색"
              placeholderTextColor="#BDBDBD"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#05A68B" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              const label = cat.key === 'all' ? `${cat.label} ${shops.length}` : cat.label;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(cat.key)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.chipDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* 하단 시트 — 지도 위에 절대 위치 */}
      <View style={styles.bottomSafe}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetRow}>
            <Text style={styles.sheetTitle}>내 주변 골목상권 {displayCount}곳</Text>
            <TouchableOpacity onPress={() => { setCategory('all'); setSearch(''); }}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={COLORS.textGray} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={() => setShowRecommend(true)}>
            <Text style={styles.ctaText}>맞춤형 가게 추천받기 →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 맞춤형 추천 바텀시트 */}
      <Modal
        visible={showRecommend}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecommend(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.recSheet}>
            {/* 헤더 */}
            <View style={styles.recHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recTitle}>{'내 취향을 반영한\n맞춤형 상점 추천'}</Text>
                <Text style={styles.recSubtitle}>{'최근 방문 이력과 관심사를 분석하여\n딱 맞는 소상공인 가게들만 골라드려요'}</Text>
              </View>
              <TouchableOpacity style={styles.recCloseBtn} onPress={() => setShowRecommend(false)}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M18 6L6 18M6 6l12 12" stroke={COLORS.textGray} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* 카테고리 칩 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recCatContent}
              style={styles.recCatScroll}
            >
              {REC_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.recChip, recCategory === cat && styles.recChipActive]}
                  onPress={() => setRecCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.recChipLabel, recCategory === cat && styles.recChipLabelActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 상점 리스트 */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.recList} showsVerticalScrollIndicator={false}>
              {REC_SHOPS.map(shop => (
                <TouchableOpacity key={shop.id} style={styles.recCard} activeOpacity={0.7}>
                  <View style={styles.recCardImg}>
                    <Image source={shop.img} style={{ width: 40, height: 40 }} resizeMode="contain" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.recCardRow}>
                      <Text style={styles.recCardName}>{shop.name}</Text>
                      <View style={styles.recTag}>
                        <Text style={styles.recTagText}>{shop.cat}</Text>
                      </View>
                    </View>
                    <Text style={styles.recCardDesc} numberOfLines={1}>{shop.desc}</Text>
                    <Text style={styles.recCardWalk}>📍 도보 {shop.walk}분</Text>
                  </View>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke="#BDBDBD" strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 하단 버튼 */}
            <View style={styles.recBottom}>
              <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
                <Text style={styles.ctaText}>다른 추천 더보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  centered:     { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white },
  loadingText:  { marginTop: 12, fontFamily: 'Hana2-Regular', fontSize: 14, color: COLORS.textGray },
  errorText:    { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.textDark, marginBottom: 6 },
  errorSub:     { fontFamily: 'Hana2-Regular', fontSize: 13, color: COLORS.textGray, marginBottom: 20 },
  backBtnPlain: { paddingVertical: 10, paddingHorizontal: 24, backgroundColor: '#05A68B', borderRadius: 10 },
  backBtnText:  { fontFamily: 'Hana2-Bold', fontSize: 14, color: COLORS.white },

  topSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  bottomSafe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  topPanel: {
    backgroundColor: 'transparent',
    paddingBottom: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerIconBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textDark,
    marginRight: 8,
    padding: 0,
  },

  filterScroll:  { flexGrow: 0, marginBottom: 4 },
  filterContent: { paddingHorizontal: 16, gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActive:      { backgroundColor: '#05A68B' },
  chipDot:         { width: 7, height: 7, borderRadius: 3.5 },
  chipLabel:       { fontFamily: 'Hana2-Medium', fontSize: 13, color: COLORS.textDark },
  chipLabelActive: { color: COLORS.white },

  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 12,
    gap: 14,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.textDark },
  ctaBtn: {
    backgroundColor: '#05A68B',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },

  // 추천 바텀시트
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  recSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '78%',
    paddingTop: 24,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  recTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 20,
    color: COLORS.textDark,
    lineHeight: 28,
    marginBottom: 6,
  },
  recSubtitle: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 18,
  },
  recCloseBtn: {
    padding: 4,
    marginLeft: 8,
  },
  recCatScroll: { flexGrow: 0, marginBottom: 12 },
  recCatContent: { paddingHorizontal: 22, gap: 8, paddingVertical: 2 },
  recChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  recChipActive: {
    backgroundColor: '#05A68B',
    borderColor: '#05A68B',
  },
  recChipLabel: {
    fontFamily: 'Hana2-Medium',
    fontSize: 13,
    color: COLORS.textDark,
  },
  recChipLabelActive: { color: COLORS.white },
  recList: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  recCardImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  recCardName: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  recTag: {
    backgroundColor: 'rgba(5, 166, 139, 0.12)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recTagText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 10,
    color: '#05A68B',
  },
  recCardDesc: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  recCardWalk: {
    fontFamily: 'Hana2-Regular',
    fontSize: 11,
    color: COLORS.textGray,
  },
  recPlaceholderTitle: { height: 14, borderRadius: 7, backgroundColor: '#EBEBEB', width: '60%' },
  recPlaceholderDesc:  { height: 11, borderRadius: 6, backgroundColor: '#F0F0F0', width: '85%' },
  recPlaceholderWalk:  { height: 11, borderRadius: 6, backgroundColor: '#F0F0F0', width: '30%' },

  recBottom: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
});
