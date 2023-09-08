<script setup lang="ts">
  import { ref } from 'vue'
  import Card, { type CardMode } from '@/components/Card.vue'
  import { initialCards, type CardListItem } from '@/data/initial-cards.ts'

  const app = ref<HTMLDivElement>()
  const showCards = ref(false)
  const cards = ref<Record<string, CardListItem>>(initialCards())

  const play = () => {
    if (showCards.value) {
      showCards.value = false
      cards.value = initialCards()
      return
    }

    showCards.value = true
  }

  const onAnimate = (id: string, state: 'start'|'end') => {
    cards.value[id].isAvailable = state !== 'start'
  }
  const onModeChange = (id: string, value: CardMode) => {
    cards.value[id].mode = value
  }

  const move = (id: string) => {
    if (!cards.value[id].isMoved) {
      const cardHeight = cards.value[id].ref?.clientHeight!
      app.value?.style.setProperty('--card-height', `${cardHeight}px`)
    }
    cards.value[id].isMoved = !cards.value[id].isMoved
  }
</script>

<template>
  <div ref="app" class="app">
    <div class="app__field">
      <div
        v-if="showCards"
        class="app__cards"
      >
        <transition-group name="list" :duration="1000">
          <card
            v-for="card in cards"
            :key="card.id"
            :suit="card.suit"
            :value="card.value"
            :animation-duration="1000"
            click-action="up"
            :class="[
            'app__card',
            {
              'app__card--disabled': !card.isAvailable,
              'app__card--moved': card.isMoved,
            },
          ]"
            @init="el => cards[card.id].ref = el"
            @change-mode="onModeChange(card.id, $event)"
            @animation-start="onAnimate(card.id, 'start')"
            @animation-end="onAnimate(card.id, 'end')"
            v-on="card.isAvailable && card.mode === 'figure' ? { click: () => move(card.id) } : {}"
          />
        </transition-group>
      </div>
    </div>

    <div class="app__actions">
      <button
        class="app__btn"
        @click="play"
      >
        Play
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app {
    --card-height: 0;

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    &__field {
      position: relative;
      flex-grow: 2;
      display: flex;
      //width: calc(100% - 300px);
      justify-content: center;
      align-items: center;
    }

    &__actions {
      position: relative;
      width: 20%;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      background-color: #0065b3;
      padding: 20px;

      @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        height: 60px;
        padding: 0;
        flex-direction: row;
        justify-content: center;
      }
    }

    &__btn {
      border: 1px solid #aaa;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 48px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #000;
      background-color: #fff;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      user-select: none;
      appearance: none;
      touch-action: manipulation;

      @media (max-width: 768px) {
        height: 40px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.90);
      }

      &:active {
        transform: scale(0.96);
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px #888;
      }
    }

    &__cards {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 25vw;
    }

    &__card {
      margin: 0 10px;
      cursor: pointer;

      &--disabled {
        pointer-events: none;
        cursor: default;
      }

      &--moved {
        top: calc(0px - var(--card-height) - 40px);
      }

      &.list-move {
        transform: scale(1.08);
      }
    }
  }
</style>
