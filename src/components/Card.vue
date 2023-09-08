<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import { suitImages } from '@/data/card-images'

  export type CardSuit = 'spades' | 'clubs' | 'diamonds' | 'hearts';
  export type CardClickAction = 'up' | 'down' | 'both';
  export type CardMode = 'figure' | 'shirt';

  export interface CardProps {
    suit?: CardSuit
    value: string;
    clickAction?: CardClickAction;
    animationDuration?: number;
  }

  const props = defineProps<CardProps>()
  const emits = defineEmits<{
    (ev: 'init', value: HTMLDivElement): void;
    (ev: 'change-mode', value: CardMode): void;
    (ev: 'animation-start'): void;
    (ev: 'animation-end'): void;
  }>()

  const cardElement = ref<HTMLDivElement>()
  const cardMode = ref<CardMode>('shirt')

  onMounted(() => {
    cardElement.value?.style
      .setProperty('--animation-duration', `${props.animationDuration ?? 500}ms`)
    emits('init', cardElement.value!)
  })

  const imgSrc = computed<string>(() => suitImages[props.suit ?? 'hearts'])
  const clickDisabled = computed(() => (props.clickAction === 'up' && cardMode.value === 'figure')
    || (props.clickAction === 'down' && cardMode.value === 'shirt'))

  const changeCardMode = () => {
    emits('animation-start')
    cardMode.value = cardMode.value === 'figure' ? 'shirt' : 'figure'
    emits('change-mode', cardMode.value)
    setTimeout(() => {
      emits('animation-end')
    }, props.animationDuration ?? 500)
  }
</script>

<template>
  <transition
    name="turn"
    :duration="2000"
  >
    <div
      ref="cardElement"
      :class="[
        `card card--${cardMode}`,
        { 'card--disabled': clickDisabled },
      ]"
      v-on="clickDisabled ? {} : { click: () => changeCardMode() }"
    >
      <div class="card__container">
        <div class="card__face card__figure">
          <div :class="`card__value card__value--${props.suit ?? 'hearts'}`">
            {{ props.value }}
          </div>

          <img
            class="card__icon"
            :src="imgSrc"
            alt="icon"
          >
        </div>
        <div class="card__face card__shirt" />
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  .card {
    --animation-duration: 500ms;
    --border-radius: 16px;

    position: relative;
    width: 20%;
    max-width: 200px;
    min-width: 80px;
    aspect-ratio: 2 / 3;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;

    &--disabled {
      cursor: default;
    }

    &__container {
      position: absolute;
      width: 100%;
      height: 100%;
      perspective: 100000px;
      perspective-origin: 100%;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    &__face {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
    }

    &__figure {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 10px;
      background-color: #fff;
    }

    &__value {
      position: relative;
      width: 22%;
      min-width: 20px;
      aspect-ratio: 1;
      text-align: center;
      font-size: calc(16px + 1vw);
      font-weight: 600;
      user-select: none;

      &--hearts,
      &--diamonds {
        color: red;
      }

      &--spades,
      &--clubs {
        color: black;
      }
    }

    &__icon {
      width: 22%;
      min-width: 20px;
      user-select: none;
    }

    &__shirt {
      background-color: midnightblue;
      border: 10px solid gray;
      transform: translateZ(-1px);
    }

    &--figure {
      transform: rotateY(0deg);
      transition-duration: var(--animation-duration);

      .card__figure {
        transform: translateZ(0);
        transition-duration: var(--animation-duration);
      }

      .card__shirt {
        transform: translateZ(-1px);
        transition-duration: var(--animation-duration);
      }
    }

    &--shirt {
      transform: rotateY(180deg);
      transition-duration: var(--animation-duration);

      .card__figure {
        transform: translateZ(-1px);
        transition-duration: var(--animation-duration);
      }

      .card__shirt {
        transform: translateZ(0);
        transition-duration: var(--animation-duration);
      }
    }
  }
</style>
