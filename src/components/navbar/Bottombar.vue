<template>
  <va-navbar class="app-layout-bottombar">
    <div class="app-bottombar-center">
      <span class="hidden md:block mr-2">&copy; 2023 {{ t('nav.title') }}</span>
      <va-button
        href="https://github.com/weagain/DestinyHashRing"
        color="#000000"
        class="hidden lg:block"
        icon="github"
        target="_blank"
      >
        {{ t('links.repository') }}
      </va-button>
      <va-button href="https://t.me/hashbid" color="#3C8FCC" class="hidden lg:block" icon="telegram" target="_blank">
        {{ t('links.community') }}
      </va-button>
    </div>
  </va-navbar>
</template>

<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '../../stores/global-store'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import VuesticLogo from '../VuesticLogo.vue'
  import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
  import AppNavbarActions from './components/AppNavbarActions.vue'

  const GlobalStore = useGlobalStore()
  const { t } = useI18n()

  const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)

  const { getColors } = useColors()
  const colors = computed(() => getColors())
</script>

<style lang="scss" scoped>
  .va-navbar {
    box-shadow: var(--va-box-shadow);
    z-index: 2;

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

    background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    color: white;
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
    height: 1rem;

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

  .bottom-bar {
    background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    color: white;
    padding: 10px 5%;
    position: fixed;
    width: 90%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
  }
</style>
