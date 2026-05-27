'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// 메인 히어로 슬라이드 — 이미지 폴더의 음식 톤 png를 일관성 있게 노출
const HERO_SLIDES = ['main', 'main1', 'main2', 'main3'];

export default function HeroSwiper() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      speed={2000}
      className="swiper hero_swiper"
    >
      {HERO_SLIDES.map((name) => (
        <SwiperSlide key={name}>
          <div
            className="hero_bg"
            style={{ backgroundImage: `url('/images/main/${name}.png')` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
