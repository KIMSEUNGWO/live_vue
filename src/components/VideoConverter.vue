
<template>
  <div class="video-file-container center">
    <div v-if="!videoFile" class="video-guide center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99984 33.3333C9.08317 33.3333 8.29873 33.0072 7.6465 32.355C6.99428 31.7028 6.66762 30.9178 6.6665 30V26.6667C6.6665 26.1944 6.8265 25.7989 7.1465 25.48C7.4665 25.1611 7.86206 25.0011 8.33317 25C8.80428 24.9989 9.20039 25.1589 9.5215 25.48C9.84261 25.8011 10.0021 26.1967 9.99984 26.6667V30H29.9998V26.6667C29.9998 26.1944 30.1598 25.7989 30.4798 25.48C30.7998 25.1611 31.1954 25.0011 31.6665 25C32.1376 24.9989 32.5337 25.1589 32.8548 25.48C33.1759 25.8011 33.3354 26.1967 33.3332 26.6667V30C33.3332 30.9167 33.0071 31.7017 32.3548 32.355C31.7026 33.0083 30.9176 33.3344 29.9998 33.3333H9.99984ZM18.3332 13.0833L15.2082 16.2083C14.8748 16.5417 14.4793 16.7017 14.0215 16.6883C13.5637 16.675 13.1676 16.5011 12.8332 16.1667C12.5276 15.8333 12.3676 15.4444 12.3532 15C12.3387 14.5556 12.4987 14.1667 12.8332 13.8333L18.8332 7.83334C18.9998 7.66667 19.1804 7.54889 19.3748 7.48C19.5693 7.41111 19.7776 7.37611 19.9998 7.375C20.2221 7.37389 20.4304 7.40889 20.6248 7.48C20.8193 7.55111 20.9998 7.66889 21.1665 7.83334L27.1665 13.8333C27.4998 14.1667 27.6598 14.5556 27.6465 15C27.6332 15.4444 27.4732 15.8333 27.1665 16.1667C26.8332 16.5 26.4376 16.6739 25.9798 16.6883C25.5221 16.7028 25.1259 16.5428 24.7915 16.2083L21.6665 13.0833V25C21.6665 25.4722 21.5065 25.8683 21.1865 26.1883C20.8665 26.5083 20.4709 26.6678 19.9998 26.6667C19.5287 26.6656 19.1332 26.5056 18.8132 26.1867C18.4932 25.8678 18.3332 25.4722 18.3332 25V13.0833Z" fill="#9DA5B6"/>
      </svg>
      <span>동영상을 업로드해주세요</span>
    </div>
    <label for="video" class="center">
      <input type="file"
             ref="videoInput"
             @change="onFileSelected"
             accept="video/mp4"
             class="hidden" name="video" id="video">
    </label>
  </div>
    {{ status }}
  {{ error }}
  {{ data }}
</template>

<script setup>
import {onMounted, ref} from "vue";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import createFFmpegCore from "@ffmpeg/core";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },

})
const emit = defineEmits(['update:modelValue']);

const videoInput = ref(null); // 파일 입력 요소를 참조
const videoFile = ref(null);  // 선택된 파일을 저장할 변수



const handleVideoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    videoFile.value = file;
    console.log('비디오 파일 선택됨:', file.name);
  }
};


const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
const videoURL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi'
const ffmpeg = new FFmpeg();
const isFFmpegLoaded = ref(false);
const progress = ref(0);
const status = ref('idle');
const error = ref(null);
const data = ref('');

onMounted(async () => {
  try {
    status.value = 'loading-ffmpegRef';


    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    })

    isFFmpegLoaded.value = true;
    status.value = 'idle';
  } catch (e) {
    error.value = '영상 처리 모듈 로드 실패: ' + e.message;
    console.error(e);
    status.value = 'error';
  }
});

const getVideoResolution = async (videoFile) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

const detectVideoQuality = (width, height) => {
  if (width >= 1920 || height >= 1080) return '1080p';
  if (width >= 1280 || height >= 720) return '720p';
  if (width >= 854 || height >= 480) return '480p';
  return '360p';
};

const onFileSelected = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    status.value = 'uploading';

    // 비디오 해상도 확인
    const { width, height } = await getVideoResolution(file);
    const originalQuality = detectVideoQuality(width, height);
    console.log(`원본 비디오 품질: ${originalQuality}`);

    // 변환 시작
    status.value = 'converting';
    const hlsData = await createHLSStreams(file, originalQuality);

    // 압축
    status.value = 'compressing';
    const compressedData = await compressHLSData(hlsData);

    status.value = 'downloading';
    downloadCompressedData(compressedData);

    // 서버에 업로드
    // status.value = 'uploading-server';
    // await uploadToServer(compressedData, {
    //   title: file.name,
    //   originalQuality
    // });

    status.value = 'completed';
  } catch (e) {
    error.value = '처리 중 오류 발생: ' + e.message;
    console.error(e);
    status.value = 'error';
  }
};

const downloadCompressedData = (compressedData, filename = 'hls_data.gz') => {
  // Blob URL 생성
  const blobUrl = URL.createObjectURL(compressedData);

  // 다운로드 링크 생성
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;

  // 링크를 DOM에 추가 (필요 없음)
  document.body.appendChild(downloadLink);

  // 다운로드 트리거
  downloadLink.click();

  // // 정리: DOM에서 링크 제거 및 Blob URL 해제
  // document.body.removeChild(downloadLink);
  // setTimeout(() => {
  //   URL.revokeObjectURL(blobUrl);
  // }, 100);
};

const createHLSStreams = async (videoFile, originalQuality) => {

  // ffmpeg.on('log', ({ message: msg }) => {
  //   console.log(msg)
  //   status.value = msg
  // })
  ffmpeg.on('progress', (progress) => {
    console.log('progress', (progress.progress * 100))
  });


  // 생성할 품질 결정
  const qualities = [];

  // Fall-Through 유도 방식
  switch (originalQuality) {
    case '1080p': qualities.push('1080p');
    case '720p': qualities.push('720p');
    case '480p': qualities.push('480p');
    case '360p': qualities.push('360p');
  }

  // 각 품질별 스트림 생성
  const streams = {};
  const inputFileName = 'input.mp4';

  // 입력 파일 쓰기
  await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

  // 품질별 변환
  for (const quality of qualities) {
    console.log(`${quality} Converting...`)
    let width, height, bitrate;

    switch (quality) {
      case '1080p':
        width = 1920;
        height = 1080;
        bitrate = '5000k';
        break;
      case '720p':
        width = 1280;
        height = 720;
        bitrate = '2500k';
        break;
      case '480p':
        width = 854;
        height = 480;
        bitrate = '1000k';
        break;
      case '360p':
        width = 640;
        height = 360;
        bitrate = '500k';
        break;
    }

    const outputFileName = `stream_${quality}.m3u8`;
    const tsPattern = `stream_${quality}_%03d.ts`;

    await ffmpeg.exec([
        '-threads', '8', // 스레드 지정
        '-i', inputFileName,
        '-vf', `scale=${width}:${height}`,
        '-b:v', bitrate,
        '-c', 'copy', // 코덱 복사
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-hls_time', '10',
        '-hls_list_size', '0',
        '-hls_segment_filename', tsPattern,
        outputFileName]
    );

    // 생성된 파일을 읽어서 저장
    streams[quality] = {
      playlist: ffmpeg.readFile(outputFileName),
      segments: []
    };

    // TS 세그먼트 파일 읽기
    let segmentIndex = 0;
    let segmentExists = true;

    while (segmentExists) {
      try {
        const segmentName = `stream_${quality}_${String(segmentIndex).padStart(3, '0')}.ts`;
        const segmentData = ffmpeg.readFile(segmentName);
        streams[quality].segments.push({ name: segmentName, data: segmentData });
        segmentIndex++;
      } catch (e) {
        segmentExists = false;
      }
    }
    console.log(`${quality} Done`)
  }

  // master 플레이리스트 생성
  let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

  for (const quality of qualities) {
    let resolution, bandwidth;

    switch (quality) {
      case '1080p':
        resolution = '1920x1080';
        bandwidth = 5000000;
        break;
      case '720p':
        resolution = '1280x720';
        bandwidth = 2500000;
        break;
      case '480p':
        resolution = '854x480';
        bandwidth = 1000000;
        break;
      case '360p':
        resolution = '640x360';
        bandwidth = 500000;
        break;
    }

    masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n`;
    masterContent += `stream_${quality}/playlist.m3u8\n`;
  }

  return {
    masterPlaylist: new TextEncoder().encode(masterContent),
    streams
  };
};

const compressHLSData = async (hlsData) => {
  // JSZip 인스턴스 생성
  const zip = new JSZip();

  // 마스터 플레이리스트 추가
  zip.file('master.m3u8', new Blob([hlsData.masterPlaylist]));

  // 각 스트림 데이터 추가
  for (const [quality, stream] of Object.entries(hlsData.streams)) {
    // 품질별 디렉토리 생성
    const folder = zip.folder(`stream_${quality}`);

    // 플레이리스트 추가
    folder.file('playlist.m3u8', new Blob([stream.playlist]));

    // 세그먼트 추가
    for (const segment of stream.segments) {
      folder.file(segment.name, new Blob([segment.data]));
    }
  }

  // zip 파일 생성
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // zip 파일을 ArrayBuffer로 변환
  const arrayBuffer = await zipBlob.arrayBuffer();

  // ArrayBuffer를 Uint8Array로 변환
  const uint8Array = new Uint8Array(arrayBuffer);

  // gzip 압축
  const compressed = pako.gzip(uint8Array);

  // 최종 압축된 데이터 반환
  return new Blob([compressed], { type: 'application/gzip' });
};
// const compressHLSData = async (hlsData) => {
//   // 마스터 플레이리스트 압축
//   const compressedMaster = pako.gzip(hlsData.masterPlaylist);
//
//   // 각 스트림 데이터 압축
//   const compressedStreams = {};
//
//   for (const [quality, stream] of Object.entries(hlsData.streams)) {
//     compressedStreams[quality] = {
//       playlist: pako.gzip(stream.playlist),
//       segments: stream.segments.map(segment => ({
//         name: segment.name,
//         data: pako.gzip(segment.data)
//       }))
//     };
//   }
//
//   return {
//     masterPlaylist: compressedMaster,
//     streams: compressedStreams
//   };
// };

// 압축된 HLS 데이터를 로컬에 저장하는 함수
const saveCompressedDataLocally = async (compressedData, videoTitle) => {
  try {
    // 파일 이름에 사용할 기본명 설정 (공백과 특수문자 제거)
    const baseFileName = videoTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'video';

    // File System Access API 지원 확인 (Chrome, Edge 등)
    if ('showDirectoryPicker' in window) {
      try {
        // 사용자에게 저장할 디렉토리 선택 요청
        const dirHandle = await window.showDirectoryPicker();

        // 마스터 플레이리스트 저장
        const masterFile = await dirHandle.getFileHandle('master.m3u8.gz', { create: true });
        const masterWritable = await masterFile.createWritable();
        await masterWritable.write(compressedData.masterPlaylist);
        await masterWritable.close();

        // 각 스트림별 디렉토리 생성 및 파일 저장
        for (const [quality, stream] of Object.entries(compressedData.streams)) {
          // 스트림 디렉토리 생성
          const streamDirHandle = await dirHandle.getDirectoryHandle(`stream_${quality}`, { create: true });

          // 플레이리스트 저장
          const playlistFile = await streamDirHandle.getFileHandle('playlist.m3u8.gz', { create: true });
          const playlistWritable = await playlistFile.createWritable();
          await playlistWritable.write(stream.playlist);
          await playlistWritable.close();

          // 세그먼트 파일 저장
          for (const segment of stream.segments) {
            const segmentFile = await streamDirHandle.getFileHandle(`${segment.name}.gz`, { create: true });
            const segmentWritable = await segmentFile.createWritable();
            await segmentWritable.write(segment.data);
            await segmentWritable.close();
          }
        }

        return { success: true, method: 'filesystem-api' };
      } catch (fsError) {
        console.warn('File System API 저장 실패, 대체 방법으로 전환:', fsError);
        // File System API가 실패하면 대체 방법으로 전환
      }
    }

    // 대체 방법: ZIP 파일로 압축하여 다운로드
    // 이 방법을 위해서는 JSZip 라이브러리가 필요합니다
    // npm install jszip
    const JSZip = (await import('jszip'));
    const zip = new JSZip();

    // 마스터 플레이리스트 추가
    zip.file('master.m3u8.gz', compressedData.masterPlaylist);

    // 각 스트림별 파일 추가
    for (const [quality, stream] of Object.entries(compressedData.streams)) {
      // 플레이리스트 추가
      zip.file(`stream_${quality}/playlist.m3u8.gz`, stream.playlist);

      // 세그먼트 파일 추가
      stream.segments.forEach(segment => {
        zip.file(`stream_${quality}/${segment.name}.gz`, segment.data);
      });
    }

    // ZIP 생성 및 다운로드
    const content = await zip.generateAsync({ type: 'blob' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = `${baseFileName}_hls_data.zip`;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);

    return { success: true, method: 'zip-download' };
  } catch (error) {
    console.error('로컬 저장 중 오류 발생:', error);
    return { success: false, error: error.message };
  }
};

const uploadToServer = async (compressedData, videoInfo) => {
  const formData = new FormData();

  // 메타데이터 추가
  formData.append('title', videoInfo.title);
  formData.append('originalQuality', videoInfo.originalQuality);

  // 압축된 HLS 데이터 추가
  formData.append('hls_data.gz', compressedData, 'hls_data.gz');

  // 서버에 업로드
  const response = await fetch('https://your-api-endpoint/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('서버 업로드 실패');
  }

  return await response.json();
};
// const uploadToServer = async (compressedData, videoInfo) => {
//   const formData = new FormData();
//
//   // 메타데이터 추가
//   formData.append('title', videoInfo.title);
//   formData.append('originalQuality', videoInfo.originalQuality);
//
//   // 마스터 플레이리스트 추가
//   formData.append(
//       'master.m3u8.gz',
//       new Blob([compressedData.masterPlaylist], { type: 'application/gzip' }),
//       'master.m3u8.gz'
//   );
//
//   // 각 스트림별 파일 추가
//   for (const [quality, stream] of Object.entries(compressedData.streams)) {
//     // 플레이리스트 추가
//     formData.append(
//         `stream_${quality}/playlist.m3u8.gz`,
//         new Blob([stream.playlist], { type: 'application/gzip' }),
//         `stream_${quality}/playlist.m3u8.gz`
//     );
//
//     // 세그먼트 추가
//     stream.segments.forEach(segment => {
//       formData.append(
//           `stream_${quality}/${segment.name}.gz`,
//           new Blob([segment.data], { type: 'application/gzip' }),
//           `stream_${quality}/${segment.name}.gz`
//       );
//     });
//   }
//
//   // 서버에 업로드
//   const response = await fetch('http://localhost:8080/upload', {
//     method: 'POST',
//     body: formData,
//   });
//
//   if (!response.ok) {
//     throw new Error('서버 업로드 실패');
//   }
//
//   return await response.json();
// };
</script>

<style scoped>
.video-file-container {
  background-color: var(--box-color);
  position: relative;
  border-radius: 16px;
}
.video-guide {
  gap: 12px;
}
label[for="video"] {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}
.video-file-container {
  height: 100px;
}
</style>