const Thumbnail = ({ content, openModal, setCurrentContentId }) => {
  const { contentId, contentSrc } = content;

  const handleClick = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    openModal();
    setCurrentContentId(contentId);
  };

  return (
    <button className="w-30 h-30 overflow-hidden" onClick={handleClick}>
      <img
        src={contentSrc}
        alt={`Content ${contentId}`}
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
    </button>
  );
};

export default Thumbnail;
