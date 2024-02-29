<template>
  <div class="app-bottombar-center gap-x-4">
    <span class="hidden md:block mr-2 ml-auto">&copy; 2024 {{ t('nav.title') }}</span>
    <a target="_blank" href="https://github.com/weagain/DestinyHashRing" class="flex items-center gap-x-1 underline"
      ><Github />{{ t('links.repository') }}</a
    >
    <a target="_blank" href="https://t.me/hashbid" class="flex items-center gap-x-1 underline mr-auto"
      ><Telegram />{{ t('links.community') }}</a
    >
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '../../stores/global-store'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import Github from '../../components/icons/Github.vue'
  import Telegram from '../../components/icons/Telegram.vue'

  const GlobalStore = useGlobalStore()
  const { t } = useI18n()

  const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)

  const { getColors } = useColors()
  const colors = computed(() => getColors())
</script>

<style lang="scss" scoped>
  .va-navbar {
    background-color: black !important;
    z-index: 2;
    color: white !important;

    @media screen and (max-width: 950px) {
      .left {
        width: 100%;
      }

      .app-navbar__actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }

    // background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  }

  .left {
    display: flex;
    align-items: center;

    & > * {
      margin-right: 1.5rem;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }

  .x-flip {
    transform: scaleX(-100%);
  }

  .app-bottombar-center {
    display: flex;
    align-items: center;
    padding: 30px 0;
    color: white;

    @media screen and (max-width: 1200px) {
      &__github-button {
        display: none;
      }
    }

    @media screen and (max-width: 950px) {
      &__text {
        display: none;
      }
    }
  }
</style>
