const EmojiAlert = () => {
  return(
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">표정 분석에 실패했어요!</strong>
      <span class="block sm:inline">얼굴을 정중앙에 맞춰주세요</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      </span>
    </div>
  );
}

export default EmojiAlert;