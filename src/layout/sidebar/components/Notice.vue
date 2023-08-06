<script lang="ts" setup>
import { useUserStore } from '@/store'
import bgImg from '@/assets/images/notice/bg.jpg'
import logoImg from '@/assets/images/notice/logo.png'

const user = useUserStore()
const isShowModal = ref(user.isShowNotice)
</script>

<template>
  <div flex items-center justify-center mt-10 mb-20 cursor-pointer w-full>
    <n-icon size="28" @click="isShowModal = true, user.changShow(true)">
      <icon-mdi:email />
    </n-icon>
  </div>
  <n-modal
    v-model:show="isShowModal"
    style="width: 960px"
    title="通知公告"
    :bordered="false"
    size="huge"
    aria-modal="true"
    preset="card"
    :on-after-leave="() => { user.changShow(false) }"
  >
    <div flex>
      <n-card flex-1 title="通知">
        <div>AI 蜂巢:</div>
        基于 Java 使用 Spring Boot 3 和 JDK 17，支持的功能有 ChatGPT、OpenAi Image、Midjourney、NewBing、文心一言等等
      </n-card>
      <div
        w-244 h-420 b-rd-10 b-2 b-hex-ededf3 ml-6
        :style="{ 'background-image': `url(${bgImg})` }"
        style="
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        "
      >
        <img w-240 b-rd-10 :src="logoImg" alt="https://www.asiayun.com/aff/PJKGJTCD">
        <div p-20 dark:c-hex-333639>
          <div style="font-size: 18px;">
            梦想在这里启航!~
          </div>
          <br>
          <div>
            精心为您挑选最适合的配置，让您即开即用、省心运营
          </div>
          <br>
          <div>
            本站专属 7.8 折优惠码：
          </div>
          <div>
            aibeehive78
          </div>
          <br>
          <a
            href="https://www.asiayun.com/aff/PJKGJTCD" target="_Blank"
          >

            <NButton type="info" dark:c-hex-fff round @click="isShowModal = false">
              点我直达
            </NButton>
          </a>
        </div>
      </div>
    </div>

    <template #footer>
      <footer flex justify-end>
        <slot name="footer">
          <NButton ml-20 type="primary" @click="isShowModal = false">
            确定
          </NButton>
        </slot>
      </footer>
    </template>
  </n-modal>
</template>
