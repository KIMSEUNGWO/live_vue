<template>
  <div class="upload-container">
    <div class="upload-file-container">
      <div class="img-file-container v-size center">
        <div v-if="!thumbnailUrl" class="thumbnail-guide center">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 7.5C5.42578 7.5 3.75 9.17578 3.75 11.25V38.6016L11.6836 30.668C13.5117 28.8398 16.4766 28.8398 18.3164 30.668L26.25 38.6016L41.6836 23.168C43.5117 21.3398 46.4766 21.3398 48.3164 23.168L56.25 31.1016V11.25C56.25 9.17578 54.5742 7.5 52.5 7.5H7.5ZM3.75 43.8984V48.75C3.75 50.8242 5.42578 52.5 7.5 52.5H12.3516L23.6016 41.25L15.668 33.3164C15.3047 32.9531 14.707 32.9531 14.3438 33.3164L3.75 43.8984ZM45.668 25.8164C45.3047 25.4531 44.707 25.4531 44.3437 25.8164L17.6484 52.5H52.5C54.5742 52.5 56.25 50.8242 56.25 48.75V36.3984L45.668 25.8164ZM0 11.25C0 7.11328 3.36328 3.75 7.5 3.75H52.5C56.6367 3.75 60 7.11328 60 11.25V48.75C60 52.8867 56.6367 56.25 52.5 56.25H7.5C3.36328 56.25 0 52.8867 0 48.75V11.25ZM18.75 16.875C18.75 16.3777 18.5525 15.9008 18.2008 15.5492C17.8492 15.1975 17.3723 15 16.875 15C16.3777 15 15.9008 15.1975 15.5492 15.5492C15.1975 15.9008 15 16.3777 15 16.875C15 17.3723 15.1975 17.8492 15.5492 18.2008C15.9008 18.5525 16.3777 18.75 16.875 18.75C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875ZM11.25 16.875C11.25 15.3832 11.8426 13.9524 12.8975 12.8975C13.9524 11.8426 15.3832 11.25 16.875 11.25C18.3668 11.25 19.7976 11.8426 20.8525 12.8975C21.9074 13.9524 22.5 15.3832 22.5 16.875C22.5 18.3668 21.9074 19.7976 20.8525 20.8525C19.7976 21.9074 18.3668 22.5 16.875 22.5C15.3832 22.5 13.9524 21.9074 12.8975 20.8525C11.8426 19.7976 11.25 18.3668 11.25 16.875Z" fill="#9DA5B6"/>
          </svg>
          <span>썸네일 이미지를 등록해주세요</span>
        </div>
        <label for="thumbnail" class="center">
          <img v-if="thumbnailUrl" :src="thumbnailUrl" alt="썸네일" class="preview-thumbnail">
          <input type="file"
                 ref="thumbnail"
                 @change="handleThumbnailChange"
                 accept="image/*"
                 class="hidden" name="thumbnail" id="thumbnail">
        </label>
      </div>
      <VideoConverter v-model="videoFile"/>
    </div>
    <ul class="upload-data-container">
      <li class="upload-data">
        <span class="title required">제목</span>
        <input type="text" name="title" id="title"
               maxlength="30" minlength="2" v-model="title"
               class="input-text input-1" placeholder="제목을 입력해주세요">
      </li>
      <li class="upload-data">
        <span class="title">영상설명</span>
        <textarea class="input-text input-area" v-model="description"
        ></textarea>
      </li>
      <li class="upload-data">
        <span class="title">태그 ({{ tags.length }}/10)</span>
        <div class="tag-container">
          <input type="text" name="tag" id="tag"
                 maxlength="10" minlength="2" v-model="tagInput"
                 @keydown.enter="handleTag"
                 class="input-text input-1">
          <div class="tags">
             <button @click="removeTag(index)" class="tag center" v-for="(tag, index) in tags" :key="index">
               <span>{{ tag }}</span>
               <svg width="10" height="10" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M2.08301 8.41671L4.99967 5.50004M4.99967 5.50004L7.91634 2.58337M4.99967 5.50004L2.08301 2.58337M4.99967 5.50004L7.91634 8.41671" stroke="#9DA5B6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
             </button>
          </div>
        </div>
      </li>
      <li class="upload-data">
        <span class="title">가격</span>
        <div class="price-container input-text input-1">
          <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.29516 10.2437C5.52772 10.8703 4.14401 11.183 3.81439 12.2416C3.4859 13.2991 4.42862 14.4027 6.3152 16.6088L6.80344 17.1791C7.33893 17.8058 7.6078 18.1196 7.72817 18.5066C7.84854 18.8947 7.80804 19.3132 7.72705 20.1491L7.6528 20.9107C7.36818 23.8547 7.22531 25.3262 8.08704 25.9798C8.94877 26.6334 10.2447 26.0372 12.8344 24.8447L13.506 24.5365C14.2418 24.1967 14.6096 24.028 15 24.028C15.3904 24.028 15.7582 24.1967 16.4951 24.5365L17.1644 24.8447C19.7553 26.0372 21.0512 26.6334 21.9118 25.9809C22.7747 25.3262 22.6318 23.8547 22.3472 20.9107M23.6848 16.6088C25.5714 14.4038 26.5141 13.3002 26.1856 12.2416C25.8571 11.183 24.4723 10.8692 21.7048 10.2437L20.9894 10.0817C20.203 9.90394 19.8104 9.81507 19.4943 9.57545C19.1782 9.33583 18.9768 8.97246 18.5718 8.24573L18.2028 7.58425C16.7775 5.02831 16.0653 3.75034 15 3.75034C13.9346 3.75034 13.2225 5.02831 11.7972 7.58425" stroke="#DFE2EA" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input type="number" name="price" id="price"
                 v-model="price" accept="application/vnd.apple.numbers"
                 min="0" max="1000"
                 @input="validateNumber">
        </div>
      </li>
      <li class="upload-data">
        <span class="title">공개 여부</span>
        <button class="input-text input-1 visibility" @click="visibility = !visibility">
          {{ visibility ? '공개' : '비공개' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>

import {ref} from "vue";
import VideoConverter from "@/components/VideoConverter.vue";

const thumbnail = ref(null);
const thumbnailUrl = ref(null);

const videoFile = ref(null);  // 선택된 파일을 저장할 변수

const title = ref('');
const description = ref('');

const tags = ref([]);
const tagInput = ref('');

const price = ref(0);

const visibility = ref(true);



const handleThumbnailChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 선택된 파일로 이미지 URL 생성
    thumbnailUrl.value = URL.createObjectURL(file);
  }
};
const handleTag = (event) => {
  const value = tagInput.value;
  if (tags.value.length >= 10) return;
  if (value.length < 2 || value.length > 10) {
    return;
  }
  if (tags.value.includes(value)) {
    tagInput.value = '';
    return;
  }
  tags.value.push(value);
  tagInput.value = '';
}
const removeTag = (index) => {
  tags.value.splice(index, 1);
}

const validateNumber = () => {
  // 입력 값이 비어있으면 0으로 설정
  if (price.value === '' || price.value === null) {
    price.value = 0;
    return;
  }

  // 문자열을 숫자로 변환
  let num = parseInt(price.value);

  // 범위를 벗어나면 가장 가까운 유효값으로 조정
  if (isNaN(num)) {
    price.value = 0;
  } else if (num < 0) {
    price.value = 0;
  } else if (num > 1000) {
    price.value = 1000;
  }
};


</script>


<style scoped>
.upload-container {
  display: flex;
  gap: 31px;
}

/* 썸네일, 비디오 */
.upload-file-container {
  display: flex;
  flex-direction: column;
  gap: 21px;

  max-width: 800px;
  width: 100%;
}

.img-file-container {
  background-color: var(--box-color);
  position: relative;
  border-radius: 16px;
}

.preview-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnail-guide {
  flex-direction: column;
  gap: 16px;
}
label[for="thumbnail"] {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}


/* 업로드 데이터 */
.required:after {
  content: ' *';
  color: var(--red);
}
.input-1 {
  width: 100%;
  height: 46px;
}
.input-area {
  width: 100%;
  padding: 15px;
  max-height: 300px;
  line-height: 150%;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
  resize: vertical;
}
.title {
  margin-bottom: 12px;
  display: block;
}

.upload-data-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  gap: 26px;
}

.tag-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tags {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background-color: var(--box-color);
  padding: 3px 6px;
  border-radius: 6px;
}
.tag span {
  color: var(--f4);
  margin-right: 5px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 130px;
}
.price-container svg {
  flex-shrink: 0;
}
#price {
  border: none;
  background-color: transparent;
  outline: none;
  font-size: var(--fs-16);
  color: var(--f2);
}

.visibility {
  width: 130px;
  text-align: start;
  font-size: var(--fs-16);
  color: var(--f2);
}
.visibility:hover {
  background-color: var(--input-border-color);
}


</style>