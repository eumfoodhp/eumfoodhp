'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

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
      {[1, 2, 3].map((i) => (
        <SwiperSlide key={i}>
          <div
            className="hero_bg"
            style={{ backgroundImage: `url('/images/main/main${i}.png')` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
